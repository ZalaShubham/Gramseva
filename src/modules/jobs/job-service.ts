import {
  SEED_JOBS,
  SEED_EMPLOYERS,
  SeedJob,
  SeedEmployer,
} from "@/lib/seed-data";
import {
  JobFilterInput,
  JobApplicationInput,
  ApplicationStatusUpdate,
  ResumeInput,
  JobPostInput,
  AdminJobInput,
  EmployerRegisterInput,
} from "./types";

// -------------------------------------------------------------------
// In-memory runtime stores
// -------------------------------------------------------------------

let inMemoryJobs: SeedJob[] = [...SEED_JOBS];
let inMemoryEmployers: SeedEmployer[] = [...SEED_EMPLOYERS];

// JobId -> Set of userIds who saved
let inMemorySavedJobs: Map<string, Set<string>> = new Map();

// `${userId}:${jobId}` -> application record
interface AppRecord {
  id: string;
  jobId: string;
  applicantId: string;
  resumeId?: string;
  coverLetter?: string;
  status: string;
  statusNotes?: string;
  notes?: string;
  isExternalTrack: boolean;
  createdAt: Date;
  updatedAt: Date;
}
let inMemoryApplications: Map<string, AppRecord> = new Map();

// userId -> resume records
interface ResumeRecord extends ResumeInput {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
let inMemoryResumes: Map<string, ResumeRecord[]> = new Map();

// Notifications store
interface NotifRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: Date;
}
let inMemoryNotifications: NotifRecord[] = [];

// Pending employer registrations (userId -> employer)
interface PendingEmployer extends EmployerRegisterInput {
  id: string;
  userId: string;
  isApproved: boolean;
  createdAt: Date;
}
let inMemoryPendingEmployers: Map<string, PendingEmployer> = new Map();

// Employer-posted jobs (in addition to seed jobs)
let inMemoryEmployerJobs: SeedJob[] = [];

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isExpired(job: SeedJob): boolean {
  const now = new Date();
  if (!job.deadline) return false;
  return new Date(job.deadline) < now;
}

function getAllJobs(): SeedJob[] {
  return [...inMemoryJobs, ...inMemoryEmployerJobs];
}

// -------------------------------------------------------------------
// List Jobs
// -------------------------------------------------------------------

export async function listJobs(
  filters: Partial<JobFilterInput> = {},
  userQualification?: string | null
) {
  const now = new Date();
  let list = getAllJobs().filter((j) => {
    // Hide expired jobs from main list
    if (isExpired(j)) return false;
    // Hide PENDING_APPROVAL and ARCHIVED
    if (j.status === "PENDING_APPROVAL" || j.status === "ARCHIVED") return false;
    return true;
  });

  // Tab filters
  if (filters.tab === "government") {
    list = list.filter((j) => j.sector === "GOVERNMENT" || j.jobType === "GOVERNMENT");
  } else if (filters.tab === "private") {
    list = list.filter((j) => j.sector === "PRIVATE" || j.sector === "PSU");
  } else if (filters.tab === "reserved") {
    list = list.filter((j) => j.isReservedForScSt === true);
  }

  // Search
  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.employerName.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.category && j.category.toLowerCase().includes(q))
    );
  }

  // Sector filter
  if (filters.sector) {
    list = list.filter((j) => j.sector === filters.sector);
  }

  // Job type filter
  if (filters.jobType) {
    list = list.filter((j) => j.jobType === filters.jobType);
  }

  // Qualification filter
  if (filters.qualification) {
    list = list.filter(
      (j) => j.qualification === filters.qualification || j.qualification === "ANY" || !j.qualification
    );
  }

  // Quota filter
  if (filters.quota) {
    if (filters.quota === "ALL") {
      // no filter — show all
    } else {
      list = list.filter(
        (j) => j.quota === filters.quota || j.quota === "ALL" || !j.quota
      );
    }
  }

  // State filter
  if (filters.state) {
    list = list.filter((j) => j.state === filters.state);
  }

  // Category filter
  if (filters.category) {
    list = list.filter((j) => j.category === filters.category);
  }

  // Qualification-wise smart sorting: jobs matching user's saved qualification appear first
  if (userQualification && userQualification !== "ANY") {
    list.sort((a, b) => {
      const aMatch = a.qualification === userQualification ? -1 : 0;
      const bMatch = b.qualification === userQualification ? -1 : 0;
      return aMatch - bMatch;
    });
  }

  const total = list.length;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const items = list.slice((page - 1) * limit, page * limit);

  return { items, total, totalPages, page };
}

// -------------------------------------------------------------------
// Get Single Job
// -------------------------------------------------------------------

export async function getJob(jobId: string): Promise<SeedJob | null> {
  return getAllJobs().find((j) => j.id === jobId) ?? null;
}

// -------------------------------------------------------------------
// Save / Unsave Job (Level 1)
// -------------------------------------------------------------------

export async function saveJob(userId: string, jobId: string): Promise<boolean> {
  const job = await getJob(jobId);
  if (!job) throw new Error("Job not found");

  if (!inMemorySavedJobs.has(jobId)) {
    inMemorySavedJobs.set(jobId, new Set());
  }
  inMemorySavedJobs.get(jobId)!.add(userId);
  return true;
}

export async function unsaveJob(userId: string, jobId: string): Promise<boolean> {
  inMemorySavedJobs.get(jobId)?.delete(userId);
  return true;
}

export async function getSavedJobs(userId: string): Promise<SeedJob[]> {
  const saved: SeedJob[] = [];
  for (const [jobId, users] of inMemorySavedJobs.entries()) {
    if (users.has(userId)) {
      const job = await getJob(jobId);
      if (job) saved.push(job);
    }
  }
  return saved;
}

export async function isJobSaved(userId: string, jobId: string): Promise<boolean> {
  return inMemorySavedJobs.get(jobId)?.has(userId) ?? false;
}

// -------------------------------------------------------------------
// Deadline Alerts for Saved Jobs (Level 1)
// -------------------------------------------------------------------

export function checkJobDeadlineAlert(deadline: string, now: Date = new Date()) {
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    is7DayAlert: diffDays > 3 && diffDays <= 7,
    is3DayAlert: diffDays > 1 && diffDays <= 3,
    is1DayAlert: diffDays >= 0 && diffDays <= 1,
    daysLeft: diffDays,
  };
}

export async function generateJobDeadlineNotifications(
  userId: string,
  now: Date = new Date()
): Promise<NotifRecord[]> {
  const savedJobs = await getSavedJobs(userId);
  const newNotifs: NotifRecord[] = [];

  for (const job of savedJobs) {
    if (!job.deadline) continue;
    const alert = checkJobDeadlineAlert(job.deadline, now);
    let alertType: string | null = null;
    let alertMsg = "";

    if (alert.is1DayAlert) {
      alertType = "1d";
      alertMsg = `Last chance! "${job.title}" application closes tomorrow.`;
    } else if (alert.is3DayAlert) {
      alertType = "3d";
      alertMsg = `3 days left to apply for "${job.title}" at ${job.employerName}.`;
    } else if (alert.is7DayAlert) {
      alertType = "7d";
      alertMsg = `7 days remaining to apply for "${job.title}".`;
    }

    if (alertType) {
      const notifKey = `${userId}:${job.id}:${alertType}`;
      // De-duplicate: skip if already sent
      const alreadySent = inMemoryNotifications.some(
        (n) => n.userId === userId && n.linkUrl.includes(job.id) && n.message === alertMsg
      );
      if (!alreadySent) {
        const notif: NotifRecord = {
          id: generateId("notif"),
          userId,
          type: "JOB",
          title: "Job Deadline Alert",
          message: alertMsg,
          linkUrl: `/jobs/${job.id}`,
          isRead: false,
          createdAt: now,
        };
        inMemoryNotifications.push(notif);
        newNotifs.push(notif);
      }
    }
  }

  return newNotifs;
}

export function getInMemoryJobNotifications(userId: string): NotifRecord[] {
  return inMemoryNotifications.filter((n) => n.userId === userId && n.type === "JOB");
}

// -------------------------------------------------------------------
// Applications (Level 2)
// -------------------------------------------------------------------

export async function applyToJob(
  userId: string,
  input: JobApplicationInput
): Promise<AppRecord> {
  const key = `${userId}:${input.jobId}`;
  if (inMemoryApplications.has(key)) {
    throw new Error("You have already applied to this job.");
  }

  const job = await getJob(input.jobId);
  if (!job) throw new Error("Job not found.");
  if (isExpired(job)) throw new Error("This job listing has expired.");

  const record: AppRecord = {
    id: generateId("app"),
    jobId: input.jobId,
    applicantId: userId,
    resumeId: input.resumeId,
    coverLetter: input.coverLetter,
    status: "APPLIED",
    notes: input.notes,
    isExternalTrack: input.isExternalTrack ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryApplications.set(key, record);

  // Create notification
  inMemoryNotifications.push({
    id: generateId("notif"),
    userId,
    type: "JOB",
    title: "Application Submitted",
    message: `Your application for "${job.title}" at ${job.employerName} has been submitted.`,
    linkUrl: `/jobs/tracker`,
    isRead: false,
    createdAt: new Date(),
  });

  return record;
}

export async function trackExternalJob(
  userId: string,
  input: JobApplicationInput
): Promise<AppRecord> {
  // For external government jobs — manual tracking only
  return applyToJob(userId, { ...input, isExternalTrack: true });
}

export async function updateApplicationStatus(
  userId: string,
  update: ApplicationStatusUpdate
): Promise<AppRecord> {
  // Find app by id
  let found: AppRecord | null = null;
  let foundKey = "";
  for (const [key, app] of inMemoryApplications.entries()) {
    if (app.id === update.applicationId && app.applicantId === userId) {
      found = app;
      foundKey = key;
      break;
    }
  }

  if (!found) throw new Error("Application not found.");

  found.status = update.status;
  found.statusNotes = update.statusNotes;
  if (update.notes) found.notes = update.notes;
  found.updatedAt = new Date();

  inMemoryApplications.set(foundKey, found);
  return found;
}

export async function getMyApplications(userId: string): Promise<(AppRecord & { job: SeedJob | null })[]> {
  const apps: (AppRecord & { job: SeedJob | null })[] = [];
  for (const [_key, app] of inMemoryApplications.entries()) {
    if (app.applicantId === userId) {
      const job = await getJob(app.jobId);
      apps.push({ ...app, job });
    }
  }
  return apps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getJobApplications(
  employerId: string,
  jobId: string
): Promise<AppRecord[]> {
  const apps: AppRecord[] = [];
  for (const [_key, app] of inMemoryApplications.entries()) {
    if (app.jobId === jobId) apps.push(app);
  }
  return apps;
}

// -------------------------------------------------------------------
// Resume Builder (Level 1)
// -------------------------------------------------------------------

export async function saveResume(
  userId: string,
  input: ResumeInput
): Promise<ResumeRecord> {
  const existing = inMemoryResumes.get(userId) ?? [];

  // If isDefault, unset others
  if (input.isDefault) {
    existing.forEach((r) => (r.isDefault = false));
  }

  const record: ResumeRecord = {
    ...input,
    id: generateId("resume"),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  existing.push(record);
  inMemoryResumes.set(userId, existing);
  return record;
}

export async function updateResume(
  userId: string,
  resumeId: string,
  input: Partial<ResumeInput>
): Promise<ResumeRecord> {
  const existing = inMemoryResumes.get(userId) ?? [];
  const idx = existing.findIndex((r) => r.id === resumeId);
  if (idx === -1) throw new Error("Resume not found.");

  existing[idx] = { ...existing[idx], ...input, updatedAt: new Date() };
  inMemoryResumes.set(userId, existing);
  return existing[idx];
}

export async function getMyResumes(userId: string): Promise<ResumeRecord[]> {
  return inMemoryResumes.get(userId) ?? [];
}

export async function getResume(userId: string, resumeId: string): Promise<ResumeRecord | null> {
  const resumes = inMemoryResumes.get(userId) ?? [];
  return resumes.find((r) => r.id === resumeId) ?? null;
}

export async function deleteResume(userId: string, resumeId: string): Promise<boolean> {
  const existing = inMemoryResumes.get(userId) ?? [];
  const filtered = existing.filter((r) => r.id !== resumeId);
  inMemoryResumes.set(userId, filtered);
  return true;
}

// -------------------------------------------------------------------
// Employer Panel
// -------------------------------------------------------------------

export async function registerEmployer(
  userId: string,
  input: EmployerRegisterInput
): Promise<PendingEmployer> {
  // Check if already registered
  if (inMemoryPendingEmployers.has(userId)) {
    throw new Error("You have already registered as an employer. Await admin approval.");
  }

  const record: PendingEmployer = {
    ...input,
    id: generateId("emp"),
    userId,
    isApproved: false,
    createdAt: new Date(),
  };

  inMemoryPendingEmployers.set(userId, record);
  return record;
}

export async function getEmployerProfile(
  userId: string
): Promise<(SeedEmployer & { isApproved: boolean }) | PendingEmployer | null> {
  // Check seed employers first
  const seed = inMemoryEmployers.find((e) => e.userId === userId);
  if (seed) return { ...seed, isApproved: seed.isApproved };

  // Check pending
  const pending = inMemoryPendingEmployers.get(userId);
  if (pending) return pending;

  return null;
}

export async function postJob(
  userId: string,
  input: JobPostInput
): Promise<SeedJob> {
  const employer = await getEmployerProfile(userId);
  if (!employer) throw new Error("You are not registered as an employer.");
  if (!employer.isApproved) {
    throw new Error(
      "Your employer account is pending admin approval. You cannot publish jobs yet."
    );
  }

  const newJob: SeedJob = {
    id: generateId("job"),
    title: input.title,
    employerName: "company" in employer ? (employer as SeedEmployer).companyName : (employer as PendingEmployer).companyName,
    employerId: employer.id,
    organizationName: undefined,
    category: input.category,
    sector: input.sector,
    jobType: input.jobType,
    workplaceType: input.workplaceType,
    qualification: input.qualification,
    quota: (input.quota ?? "ALL") as "SC" | "ST" | "GENERAL" | "ALL",
    ageRelaxation: input.ageRelaxation,
    minAge: input.minAge,
    maxAge: input.maxAge,
    state: input.state,
    district: input.district ?? "",
    city: input.city ?? "",
    minSalary: input.minSalary,
    maxSalary: input.maxSalary,
    isReservedForScSt: input.isReservedForScSt,
    targetCommunity: input.targetCommunity ?? null,
    vacancies: input.vacancies,
    deadline: input.deadline,
    description: input.description,
    requirements: input.requirements,
    howToApplySteps: input.howToApplySteps,
    officialUrl: input.officialUrl || undefined,
    sourceUrl: input.sourceUrl,
    syllabusUrl: input.syllabusUrl || undefined,
    admitCardUrl: input.admitCardUrl || undefined,
    resultUrl: input.resultUrl || undefined,
    isExternal: input.isExternal,
    status: "ACTIVE",
    isActive: true,
  };

  inMemoryEmployerJobs.push(newJob);
  return newJob;
}

export async function getEmployerJobs(userId: string): Promise<SeedJob[]> {
  const employer = await getEmployerProfile(userId);
  if (!employer) return [];

  const empId = employer.id;
  return getAllJobs().filter((j) => j.employerId === empId);
}

export async function updateEmployerJob(
  userId: string,
  jobId: string,
  input: Partial<JobPostInput>
): Promise<SeedJob> {
  const employer = await getEmployerProfile(userId);
  if (!employer || !employer.isApproved) throw new Error("Not authorized.");

  const idx = inMemoryEmployerJobs.findIndex(
    (j) => j.id === jobId && j.employerId === employer.id
  );
  if (idx === -1) throw new Error("Job not found or not owned by this employer.");

  inMemoryEmployerJobs[idx] = { ...inMemoryEmployerJobs[idx], ...input } as SeedJob;
  return inMemoryEmployerJobs[idx];
}

// -------------------------------------------------------------------
// Admin Functions
// -------------------------------------------------------------------

export async function adminApproveEmployer(
  employerId: string
): Promise<boolean> {
  // Check pending employers
  for (const [userId, emp] of inMemoryPendingEmployers.entries()) {
    if (emp.id === employerId) {
      inMemoryPendingEmployers.set(userId, { ...emp, isApproved: true });
      return true;
    }
  }

  // Check seed employers
  const idx = inMemoryEmployers.findIndex((e) => e.id === employerId);
  if (idx !== -1) {
    inMemoryEmployers[idx].isApproved = true;
    return true;
  }

  throw new Error("Employer not found.");
}

export async function adminRejectEmployer(employerId: string): Promise<boolean> {
  for (const [userId, emp] of inMemoryPendingEmployers.entries()) {
    if (emp.id === employerId) {
      inMemoryPendingEmployers.delete(userId);
      return true;
    }
  }
  throw new Error("Pending employer not found.");
}

export async function adminGetPendingEmployers(): Promise<PendingEmployer[]> {
  return Array.from(inMemoryPendingEmployers.values()).filter((e) => !e.isApproved);
}

export async function adminGetAllEmployers(): Promise<(SeedEmployer | PendingEmployer)[]> {
  const seeds = inMemoryEmployers.map((e) => ({ ...e }));
  const pending = Array.from(inMemoryPendingEmployers.values());
  return [...seeds, ...pending];
}

export async function adminCreateJob(input: AdminJobInput): Promise<SeedJob> {
  const newJob: SeedJob = {
    id: generateId("job"),
    title: input.title,
    employerName: input.organizationName ?? "Government / Admin Posted",
    organizationName: input.organizationName,
    category: input.category,
    sector: input.sector,
    jobType: input.jobType,
    workplaceType: input.workplaceType,
    qualification: input.qualification,
    quota: (input.quota ?? "ALL") as "SC" | "ST" | "GENERAL" | "ALL",
    ageRelaxation: input.ageRelaxation,
    minAge: input.minAge,
    maxAge: input.maxAge,
    state: input.state,
    district: input.district ?? "",
    city: input.city ?? "",
    minSalary: input.minSalary,
    maxSalary: input.maxSalary,
    isReservedForScSt: input.isReservedForScSt,
    targetCommunity: input.targetCommunity ?? null,
    vacancies: input.vacancies,
    deadline: input.deadline,
    description: input.description,
    requirements: input.requirements,
    howToApplySteps: input.howToApplySteps,
    officialUrl: input.officialUrl || undefined,
    sourceUrl: input.sourceUrl,
    syllabusUrl: input.syllabusUrl || undefined,
    admitCardUrl: input.admitCardUrl || undefined,
    resultUrl: input.resultUrl || undefined,
    isExternal: input.isExternal,
    status: input.status ?? "ACTIVE",
    isActive: input.status === "ACTIVE",
  };

  inMemoryJobs.push(newJob);
  return newJob;
}

export async function adminUpdateJob(
  jobId: string,
  input: Partial<AdminJobInput>
): Promise<SeedJob | null> {
  const idx = inMemoryJobs.findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    inMemoryJobs[idx] = { ...inMemoryJobs[idx], ...input } as SeedJob;
    return inMemoryJobs[idx];
  }
  const idx2 = inMemoryEmployerJobs.findIndex((j) => j.id === jobId);
  if (idx2 !== -1) {
    inMemoryEmployerJobs[idx2] = { ...inMemoryEmployerJobs[idx2], ...input } as SeedJob;
    return inMemoryEmployerJobs[idx2];
  }
  return null;
}

export async function adminListAllJobs(includeExpired = false): Promise<SeedJob[]> {
  const all = getAllJobs();
  if (includeExpired) return all;
  return all.filter((j) => !isExpired(j));
}

export async function adminListExpiredJobs(): Promise<SeedJob[]> {
  return getAllJobs().filter((j) => isExpired(j) || j.status === "EXPIRED" || j.status === "ARCHIVED");
}

// -------------------------------------------------------------------
// Export helpers for tests
// -------------------------------------------------------------------
export function getInMemoryApplications() {
  return Array.from(inMemoryApplications.values());
}

export function getInMemoryNotifications(userId?: string) {
  if (!userId) return inMemoryNotifications;
  return inMemoryNotifications.filter((n) => n.userId === userId);
}

export function resetInMemoryStore() {
  inMemoryJobs = [...SEED_JOBS];
  inMemoryEmployers = [...SEED_EMPLOYERS];
  inMemorySavedJobs = new Map();
  inMemoryApplications = new Map();
  inMemoryResumes = new Map();
  inMemoryNotifications = [];
  inMemoryPendingEmployers = new Map();
  inMemoryEmployerJobs = [];
}
