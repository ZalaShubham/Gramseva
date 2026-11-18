/*
 * Matrimonial module type definitions
 * All fields are strongly typed to support validation and i18n.
 */

export enum CreatedBy {
  Self = "self",
  Parent = "parent",
  Sibling = "sibling",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum PhotoPrivacy {
  Public = "public", // visible to anyone logged in
  InterestAccepted = "interestAccepted", // visible after the other side accepts your interest
  Private = "private", // only the profile owner
}

export enum RelationStatus {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined",
  Shortlisted = "shortlisted",
}

export interface Profile {
  id: string;
  createdBy: CreatedBy;
  ownerUserId: string; // the user who owns this profile
  name: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string
  heightCm?: number;
  education?: string;
  occupation?: string;
  incomeRange?: string;
  nativePlace?: string;
  subCaste: string; // dropdown option, stored as key
  photos: Photo[];
  familyVerified?: boolean; // derived from My Network connections
  partnerPreference?: Preference;
  privacySettings: PrivacySettings;
  isVerified?: boolean; // Level 2 verified badge
}

export interface Photo {
  id: string;
  url: string; // relative to /public/... (expressed as /matrimonial/photos/…)
  privacy: PhotoPrivacy;
}

export interface Preference {
  minAge?: number;
  maxAge?: number;
  educationLevels?: string[]; // list of acceptable education strings
  occupations?: string[];
  locations?: string[]; // native places or current city
  subCaste?: string[];
}

export interface Interest {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  status: RelationStatus;
  createdAt: Date;
  updatedAt: Date;
  suggestedRelation?: string; // optional when receiver suggests correction
}

export interface Block {
  blockerUserId: string;
  blockedUserId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  reason: string;
  createdAt: Date;
  reviewed?: boolean;
}

export interface PrivacySettings {
  showPhone: boolean; // true only after interest accepted
  showFamilyTree: boolean; // true only after interest accepted
  showSocialLinks: boolean; // true only after interest accepted
  photoPrivacy: PhotoPrivacy; // default for new photos
}

export interface FamilyTreeNode {
  profileId: string;
  relation: string; // e.g., "Father", "Mother", "Brother"
  children?: FamilyTreeNode[];
}
