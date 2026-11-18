/*
 * In‑memory service for the Matrimonial module.
 * Mirrors the pattern used by other modules (jobs, scholarships, etc.).
 */

import { Profile, CreatedBy, Gender, Photo, Preference, Interest, RelationStatus, Block, Report, PrivacySettings, PhotoPrivacy } from "./types";
import { getFamilyTree } from "../network/network-service"; // reuse My Network API

// Replace uuidv4 with built‑in crypto.randomUUID for environments without the `uuid` package
const generateId = () => crypto.randomUUID();

// ---------- In‑memory stores ----------
const profiles: Record<string, Profile> = {};
const interests: Record<string, Interest> = {};
const blocks: Block[] = [];
const reports: Record<string, Report> = {};

// Monthly request counters – keyed by userId and month (YYYY‑MM)
const monthlyRequestCount: Record<string, { month: string; count: number }> = {};

// ---------- Helper utilities ----------
function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function checkLegalAge(profile: Profile): void {
  const age = calculateAge(profile.dateOfBirth);
  if (profile.gender === Gender.Male && age < 21) {
    throw new Error("Male profiles must be at least 21 years old");
  }
  if (profile.gender === Gender.Female && age < 18) {
    throw new Error("Female profiles must be at least 18 years old");
  }
}

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function incrementRequestCount(userId: string): void {
  const monthKey = getCurrentMonthKey();
  const entry = monthlyRequestCount[userId];
  if (!entry || entry.month !== monthKey) {
    monthlyRequestCount[userId] = { month: monthKey, count: 1 };
    return;
  }
  if (entry.count >= 30) {
    // arbitrary monthly limit, can be tweaked later
    throw new Error("Monthly connection request limit reached");
  }
  entry.count++;
}

function isBlocked(viewerId: string, targetUserId: string): boolean {
  return blocks.some(b => b.blockerUserId === viewerId && b.blockedUserId === targetUserId);
}

// ---------- Service API ----------
export const matrimonialService = {
  // ---- Profile CRUD ----
  createProfile: (
    ownerUserId: string,
    data: Omit<Profile, "id" | "ownerUserId" | "photos" | "privacySettings"> & { photos?: Photo[]; privacySettings?: PrivacySettings }
  ) => {
    const id = generateId();
    const baseProfile: Profile = {
      id,
      ownerUserId,
      createdBy: data.createdBy as CreatedBy,
      name: data.name,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      heightCm: data.heightCm,
      education: data.education,
      occupation: data.occupation,
      incomeRange: data.incomeRange,
      nativePlace: data.nativePlace,
      subCaste: data.subCaste,
      photos: data.photos ?? [],
      partnerPreference: data.partnerPreference as Preference,
      privacySettings: data.privacySettings ?? {
        showPhone: false,
        showFamilyTree: false,
        showSocialLinks: false,
        photoPrivacy: PhotoPrivacy.Private,
      },
    };
    // enforce age rule
    checkLegalAge(baseProfile);
    profiles[id] = baseProfile;
    return baseProfile;
  },

  getProfile: (viewerUserId: string, profileId: string) => {
    const profile = profiles[profileId];
    if (!profile) throw new Error("Profile not found");
    if (isBlocked(viewerUserId, profile.ownerUserId) || isBlocked(profile.ownerUserId, viewerUserId)) {
      throw new Error("Access blocked");
    }
    // Determine if a mutual accepted interest exists
    const hasMutualInterest = Object.values(interests).some(
      i =>
        i.status === RelationStatus.Accepted &&
        ((i.fromProfileId === profileId && i.toProfileId === viewerUserId) ||
          (i.fromProfileId === viewerUserId && i.toProfileId === profileId))
    );
    const safeProfile: any = { ...profile };
    if (!profile.privacySettings.showPhone) delete safeProfile.phone;
    if (!profile.privacySettings.showFamilyTree) delete safeProfile.familyVerified;
    if (!profile.privacySettings.showSocialLinks) delete safeProfile.socialLinks;
    // Photo visibility per individual privacy setting
    safeProfile.photos = profile.photos.map(p => {
      if (p.privacy === PhotoPrivacy.Public) return p;
      if (p.privacy === PhotoPrivacy.Private) return { ...p, url: undefined };
      // InterestAccepted – only when mutual interest
      return hasMutualInterest ? p : { ...p, url: undefined };
    });
    return safeProfile;
  },

  updateProfile: (ownerUserId: string, profileId: string, updates: Partial<Profile>) => {
    const profile = profiles[profileId];
    if (!profile) throw new Error("Profile not found");
    if (profile.ownerUserId !== ownerUserId) throw new Error("Unauthorized");
    const updated = { ...profile, ...updates } as Profile;
    if (updates.dateOfBirth || updates.gender) checkLegalAge(updated);
    profiles[profileId] = updated;
    return updated;
  },

  deleteProfile: (ownerUserId: string, profileId: string) => {
    const profile = profiles[profileId];
    if (!profile) throw new Error("Profile not found");
    if (profile.ownerUserId !== ownerUserId) throw new Error("Unauthorized");
    delete profiles[profileId];
    // Clean up related interests – keep blocks (user‑level) and reports for audit
    for (const id in interests) {
      const i = interests[id];
      if (i.fromProfileId === profileId || i.toProfileId === profileId) delete interests[id];
    }
    return true;
  },

  // ---- Interest flow ----
  sendInterest: (fromProfileId: string, toProfileId: string, suggestedRelation?: string) => {
    if (fromProfileId === toProfileId) throw new Error("Cannot send interest to self");
    const existing = Object.values(interests).find(
      i => (i.fromProfileId === fromProfileId && i.toProfileId === toProfileId) ||
        (i.fromProfileId === toProfileId && i.toProfileId === fromProfileId)
    );
    if (existing && existing.status !== RelationStatus.Declined) {
      throw new Error("Interest already exists");
    }
    const fromProfile = profiles[fromProfileId];
    if (!fromProfile) throw new Error("Sender profile not found");
    incrementRequestCount(fromProfile.ownerUserId);
    const id = generateId();
    const interest: Interest = {
      id,
      fromProfileId,
      toProfileId,
      status: RelationStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
      suggestedRelation,
    } as Interest;
    interests[id] = interest;
    return interest;
  },

  respondInterest: (interestId: string, action: "accept" | "decline" | "shortlist" | "withdraw", suggestedRelation?: string) => {
    const interest = interests[interestId];
    if (!interest) throw new Error("Interest not found");
    switch (action) {
      case "accept":
        interest.status = RelationStatus.Accepted;
        break;
      case "decline":
        interest.status = RelationStatus.Declined;
        break;
      case "shortlist":
        interest.status = RelationStatus.Shortlisted;
        break;
      case "withdraw":
        // only the originator may withdraw a pending request
        interest.status = RelationStatus.Declined;
        break;
    }
    if (suggestedRelation) interest.suggestedRelation = suggestedRelation;
    interest.updatedAt = new Date();
    return interest;
  },

  // ---- Block & Report ----
  blockUser: (blockerUserId: string, blockedUserId: string) => {
    if (isBlocked(blockerUserId, blockedUserId)) throw new Error("User already blocked");
    const entry: Block = { blockerUserId, blockedUserId, createdAt: new Date() };
    blocks.push(entry);
    return entry;
  },

  reportUser: (reporterUserId: string, reportedUserId: string, reason: string) => {
    const id = generateId();
    const report: Report = { id, reporterUserId, reportedUserId, reason, createdAt: new Date() };
    reports[id] = report;
    return report;
  },

  // ---- Privacy helpers ----
  canViewPhoto: (viewerUserId: string, photo: Photo, profileOwnerId: string) => {
    if (photo.privacy === PhotoPrivacy.Public) return true;
    if (photo.privacy === PhotoPrivacy.Private) return viewerUserId === profileOwnerId;
    // InterestAccepted
    const hasAccepted = Object.values(interests).some(
      i => i.status === RelationStatus.Accepted &&
        ((i.fromProfileId === profileOwnerId && i.toProfileId === viewerUserId) ||
          (i.fromProfileId === viewerUserId && i.toProfileId === profileOwnerId))
    );
    return hasAccepted;
  },

  // ---- Family tree integration ----
  getFamilyTreeForProfile: async (profileId: string) => {
    const profile = profiles[profileId];
    if (!profile) throw new Error("Profile not found");
    const tree = await getFamilyTree(profile.ownerUserId);
    return tree; // caller can add "family verified" flag based on accepted connections
  },
};
