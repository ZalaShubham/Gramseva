import {
  SEED_SCHOLARSHIPS,
  SeedScholarship,
} from "@/lib/seed-data";
import {
  ScholarshipFilterInput,
  EligibilityCheckInput,
  EligibilityResult,
  ScholarshipTrackInput,
  AdminScholarshipInput,
} from "./types";

// In-memory runtime store for dev mode / tests
const inMemoryScholarships: SeedScholarship[] = [...SEED_SCHOLARSHIPS];
const inMemoryTracks: Record<
  string, // `${userId}:${scholarshipId}`
  {
    id: string;
    userId: string;
    scholarshipId: string;
    status: string;
    notes?: string;
    checklistState?: Record<string, boolean>;
    alert7d: boolean;
    alert3d: boolean;
    alert1d: boolean;
    updatedAt: Date;
  }
> = {};

const inMemoryNotifications: Array<{
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: Date;
}> = [];

const inMemoryAuditLogs: Array<{
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  createdAt: Date;
}> = [];

/**
 * List scholarships with search, multi-faceted filtering, and active vs ended tabs.
 */
export async function listScholarships(
  filters: Partial<ScholarshipFilterInput> = {}
) {
  const now = new Date();
  let list = [...inMemoryScholarships];

  // 1. Tab filter: Active vs Ended
  if (filters.tab === "ended") {
    list = list.filter((s) => {
      const isPastDeadline = new Date(s.deadline) < now;
      return isPastDeadline || s.status === "CLOSED";
    });
  } else {
    list = list.filter((s) => {
      const isPastDeadline = new Date(s.deadline) < now;
      return !isPastDeadline && s.status !== "CLOSED";
    });
  }

  // 2. Search query (title, provider, description)
  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }

  // 3. Category filter (HIGHER_STUDY, ABROAD, COACHING, HOSTEL, PRE_MATRIC, POST_MATRIC)
  if (filters.category && filters.category !== "ALL") {
    list = list.filter((s) => s.category === filters.category);
  }

  // 4. Class level filter
  if (filters.classLevel && filters.classLevel !== "ALL") {
    list = list.filter((s) => s.classLevel === filters.classLevel || !s.classLevel);
  }

  // 5. Course stream filter
  if (filters.course && filters.course !== "ALL") {
    list = list.filter(
      (s) => s.course === filters.course || s.course === "ALL" || !s.course
    );
  }

  // 6. State filter
  if (filters.state && filters.state !== "ALL") {
    list = list.filter((s) => s.state === filters.state || s.isNational);
  }

  // 7. Community category filter (SC / ST)
  if (filters.community) {
    list = list.filter(
      (s) => !s.community || s.community === filters.community
    );
  }

  // 8. Provider filter
  if (filters.provider && filters.provider !== "ALL") {
    list = list.filter((s) =>
      s.provider.toLowerCase().includes(filters.provider!.toLowerCase())
    );
  }

  // 9. Max family income filter
  if (filters.maxIncome && filters.maxIncome > 0) {
    list = list.filter(
      (s) => !s.maxFamilyIncome || s.maxFamilyIncome >= filters.maxIncome!
    );
  }

  const total = list.length;
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const items = list.slice(startIndex, startIndex + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  };
}

/**
 * Retrieve single scholarship details by ID
 */
export async function getScholarshipById(id: string): Promise<SeedScholarship | null> {
  const item = inMemoryScholarships.find((s) => s.id === id);
  return item || null;
}

/**
 * Business Rule: Eligibility Checker with granular match and mismatch reasons.
 */
export function checkScholarshipEligibility(
  scheme: SeedScholarship,
  input: EligibilityCheckInput
): EligibilityResult {
  const matchReasons: string[] = [];
  const mismatchReasons: string[] = [];

  // 1. Community check
  if (!scheme.community) {
    matchReasons.push("Open to all Scheduled Caste (SC) and Scheduled Tribe (ST) candidates.");
  } else if (scheme.community === input.community) {
    matchReasons.push(`Eligible community: Matches applicant's ${input.community} category.`);
  } else {
    mismatchReasons.push(`Scheme is reserved exclusively for ${scheme.community} students.`);
  }

  // 2. Annual Income limit check
  if (!scheme.maxFamilyIncome) {
    matchReasons.push("No family income ceiling specified for this scheme.");
  } else if (input.annualIncome <= scheme.maxFamilyIncome) {
    matchReasons.push(
      `Family income ₹${input.annualIncome.toLocaleString("en-IN")} is within the maximum limit of ₹${scheme.maxFamilyIncome.toLocaleString("en-IN")}.`
    );
  } else {
    mismatchReasons.push(
      `Family annual income (₹${input.annualIncome.toLocaleString("en-IN")}) exceeds scheme ceiling of ₹${scheme.maxFamilyIncome.toLocaleString("en-IN")}.`
    );
  }

  // 3. Class level check
  if (!scheme.classLevel || scheme.classLevel === input.classLevel) {
    matchReasons.push(`Education level matches eligibility criteria (${input.classLevel}).`);
  } else {
    mismatchReasons.push(
      `Requires ${scheme.classLevel} study level; applicant specified ${input.classLevel}.`
    );
  }

  // 4. Course check
  if (!scheme.course || scheme.course === "ALL" || scheme.course === input.course) {
    matchReasons.push(`Course stream (${input.course}) is recognized.`);
  } else {
    mismatchReasons.push(
      `Targeted towards ${scheme.course} curriculum; applicant is in ${input.course}.`
    );
  }

  // 5. State domicile check
  if (scheme.isNational) {
    matchReasons.push("Pan-India national central scheme (applicable across all states).");
  } else if (scheme.state && scheme.state.toLowerCase() === input.state.toLowerCase()) {
    matchReasons.push(`Domicile verified for state of ${scheme.state}.`);
  } else {
    mismatchReasons.push(`Scheme applies only to ${scheme.state} residents.`);
  }

  // 6. Academic percentage check
  if (scheme.minPercentage && input.percentage !== undefined) {
    if (input.percentage >= scheme.minPercentage) {
      matchReasons.push(
        `Academic score (${input.percentage}%) meets or exceeds ${scheme.minPercentage}% benchmark.`
      );
    } else {
      mismatchReasons.push(
        `Academic score of ${input.percentage}% is below mandatory ${scheme.minPercentage}% cutoff.`
      );
    }
  }

  const isEligible = mismatchReasons.length === 0;

  return {
    scholarshipId: scheme.id,
    title: scheme.title,
    provider: scheme.provider,
    awardAmount: scheme.awardAmount,
    deadline: scheme.deadline,
    category: scheme.category,
    applicationUrl: scheme.applicationUrl,
    isEligible,
    matchReasons,
    mismatchReasons,
  };
}

/**
 * Check multiple scholarships for a candidate
 */
export async function checkAllScholarshipsEligibility(input: EligibilityCheckInput) {
  const now = new Date();
  const activeSchemes = inMemoryScholarships.filter(
    (s) => new Date(s.deadline) >= now && s.status !== "CLOSED"
  );

  const results = activeSchemes.map((scheme) =>
    checkScholarshipEligibility(scheme, input)
  );

  // Sort: Eligible first, then by highest award amount
  results.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.awardAmount - a.awardAmount;
  });

  return results;
}

/**
 * Business Rule: Application Tracking & Document Checklist Tick-off (Level 1+)
 */
export async function upsertScholarshipTrack(
  userId: string,
  input: ScholarshipTrackInput
) {
  const key = `${userId}:${input.scholarshipId}`;
  const existing = inMemoryTracks[key];

  const record = {
    id: existing?.id || `track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    scholarshipId: input.scholarshipId,
    status: input.status,
    notes: input.notes !== undefined ? input.notes : existing?.notes,
    checklistState:
      input.checklistState !== undefined
        ? input.checklistState
        : existing?.checklistState || {},
    alert7d: existing?.alert7d || false,
    alert3d: existing?.alert3d || false,
    alert1d: existing?.alert1d || false,
    updatedAt: new Date(),
  };

  inMemoryTracks[key] = record;

  // Log to AuditLog
  inMemoryAuditLogs.push({
    id: `audit-${Date.now()}`,
    userId,
    action: "SCHOLARSHIP_TRACK_UPDATE",
    entityType: "ScholarshipTrack",
    entityId: record.id,
    details: { scholarshipId: input.scholarshipId, status: input.status },
    createdAt: new Date(),
  });

  return record;
}

/**
 * Get all tracked items for a user
 */
export async function getUserScholarshipTracks(userId: string) {
  const tracks = Object.values(inMemoryTracks).filter((t) => t.userId === userId);
  return tracks.map((track) => {
    const scholarship = inMemoryScholarships.find((s) => s.id === track.scholarshipId);
    return {
      ...track,
      scholarship,
    };
  });
}

/**
 * Business Rule: Deadline Calendar & Alert Generation for 7, 3, and 1 day before.
 */
export function checkDeadlineAlertThreshold(
  deadlineDate: Date,
  currentDate = new Date()
): { is7DayAlert: boolean; is3DayAlert: boolean; is1DayAlert: boolean; daysRemaining: number } {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffTime = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(diffTime / msPerDay);

  return {
    is7DayAlert: daysRemaining <= 7 && daysRemaining > 3,
    is3DayAlert: daysRemaining <= 3 && daysRemaining > 1,
    is1DayAlert: daysRemaining <= 1 && daysRemaining >= 0,
    daysRemaining,
  };
}

/**
 * Generate notifications for tracked scholarships approaching deadlines (7, 3, 1 day)
 */
export async function generateDeadlineNotifications(userId: string, currentDate = new Date()) {
  const userTracks = Object.values(inMemoryTracks).filter((t) => t.userId === userId);
  const newNotifications: any[] = [];

  for (const track of userTracks) {
    const scholarship = inMemoryScholarships.find((s) => s.id === track.scholarshipId);
    if (!scholarship) continue;

    const deadline = new Date(scholarship.deadline);
    const { is7DayAlert, is3DayAlert, is1DayAlert, daysRemaining } =
      checkDeadlineAlertThreshold(deadline, currentDate);

    if (daysRemaining < 0) continue;

    // Check 1-day alert
    if (is1DayAlert && !track.alert1d) {
      track.alert1d = true;
      const notif = {
        id: `notif-1d-${Date.now()}-${track.id}`,
        userId,
        type: "SCHOLARSHIP",
        title: `URGENT: 1 Day Left for ${scholarship.title}`,
        message: `The deadline for ${scholarship.title} is tomorrow (${deadline.toLocaleDateString()}). Submit your application and verified documents now.`,
        linkUrl: `/scholarships/${scholarship.id}`,
        isRead: false,
        createdAt: new Date(),
      };
      inMemoryNotifications.push(notif);
      newNotifications.push(notif);
    }
    // Check 3-day alert
    else if (is3DayAlert && !track.alert3d) {
      track.alert3d = true;
      const notif = {
        id: `notif-3d-${Date.now()}-${track.id}`,
        userId,
        type: "SCHOLARSHIP",
        title: `3 Days Left for ${scholarship.title}`,
        message: `Only 3 days remaining before ${scholarship.title} closes. Complete your checklist ticks and portal submission.`,
        linkUrl: `/scholarships/${scholarship.id}`,
        isRead: false,
        createdAt: new Date(),
      };
      inMemoryNotifications.push(notif);
      newNotifications.push(notif);
    }
    // Check 7-day alert
    else if (is7DayAlert && !track.alert7d) {
      track.alert7d = true;
      const notif = {
        id: `notif-7d-${Date.now()}-${track.id}`,
        userId,
        type: "SCHOLARSHIP",
        title: `7 Days Reminder: ${scholarship.title}`,
        message: `Deadline in 7 days for ${scholarship.title}. Make sure caste and income certificates are ready.`,
        linkUrl: `/scholarships/${scholarship.id}`,
        isRead: false,
        createdAt: new Date(),
      };
      inMemoryNotifications.push(notif);
      newNotifications.push(notif);
    }
  }

  return newNotifications;
}

/**
 * Admin Panel: Create, Edit, Archive Scholarships (Role: ADMIN)
 */
export async function createScholarship(input: AdminScholarshipInput, adminUserId: string) {
  const newScholarship: SeedScholarship = {
    id: `sch-adm-${Date.now()}`,
    title: input.title,
    provider: input.provider,
    description: input.description,
    eligibilityCriteria: input.eligibilityCriteria,
    educationLevel: input.classLevel || "UNDERGRADUATE",
    category: input.category,
    course: input.course,
    classLevel: input.classLevel,
    community: input.community || null,
    awardAmount: input.awardAmount,
    deadline: new Date(input.deadline).toISOString(),
    state: input.state || null,
    isNational: input.isNational,
    applicationUrl: input.applicationUrl,
    sourceUrl: input.sourceUrl,
    howToApplySteps: input.howToApplySteps,
    documentsRequired: input.documentsRequired,
    commonRejectionReasons: input.commonRejectionReasons,
    lastVerifiedAt: new Date().toISOString(),
    status: input.status,
    minPercentage: input.minPercentage,
    maxFamilyIncome: input.maxFamilyIncome,
  };

  inMemoryScholarships.unshift(newScholarship);

  inMemoryAuditLogs.push({
    id: `audit-${Date.now()}`,
    userId: adminUserId,
    action: "SCHOLARSHIP_CREATE",
    entityType: "Scholarship",
    entityId: newScholarship.id,
    details: { title: newScholarship.title, sourceUrl: newScholarship.sourceUrl },
    createdAt: new Date(),
  });

  return newScholarship;
}

export async function updateScholarship(
  id: string,
  input: Partial<AdminScholarshipInput>,
  adminUserId: string
) {
  const index = inMemoryScholarships.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Scholarship not found");
  }

  const existing = inMemoryScholarships[index];
  const updated: SeedScholarship = {
    ...existing,
    ...input,
    deadline: input.deadline ? new Date(input.deadline).toISOString() : existing.deadline,
    lastVerifiedAt: new Date().toISOString(),
  };

  inMemoryScholarships[index] = updated;

  inMemoryAuditLogs.push({
    id: `audit-${Date.now()}`,
    userId: adminUserId,
    action: "SCHOLARSHIP_UPDATE",
    entityType: "Scholarship",
    entityId: id,
    details: input,
    createdAt: new Date(),
  });

  return updated;
}

export async function archiveScholarship(id: string, adminUserId: string) {
  const index = inMemoryScholarships.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Scholarship not found");
  }

  inMemoryScholarships[index].status = "CLOSED";

  inMemoryAuditLogs.push({
    id: `audit-${Date.now()}`,
    userId: adminUserId,
    action: "SCHOLARSHIP_ARCHIVE",
    entityType: "Scholarship",
    entityId: id,
    details: { status: "CLOSED" },
    createdAt: new Date(),
  });

  return inMemoryScholarships[index];
}

// Helper to inspect notifications in tests
export function getInMemoryNotifications(userId?: string) {
  if (userId) return inMemoryNotifications.filter((n) => n.userId === userId);
  return inMemoryNotifications;
}
