import { z } from "zod";

// -------------------------------------------------------------------
// Constants / Label Maps
// -------------------------------------------------------------------

export const JOB_SECTORS = ["GOVERNMENT", "PRIVATE", "PSU"] as const;
export type JobSector = (typeof JOB_SECTORS)[number];

export const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "GOVERNMENT",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const WORKPLACE_TYPES = ["ON_SITE", "HYBRID", "REMOTE"] as const;
export type WorkplaceType = (typeof WORKPLACE_TYPES)[number];

export const JOB_CATEGORIES = [
  "IT",
  "ENGINEERING",
  "BANKING",
  "HEALTHCARE",
  "GOVERNMENT_PSC",
  "SKILLED_LABOR",
  "EDUCATION",
  "AGRICULTURE",
  "LEGAL",
  "SOCIAL_SECTOR",
  "CUSTOMER_SERVICE",
  "OTHER",
] as const;
export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const JOB_QUALIFICATIONS = [
  "ANY",
  "10TH_PASS",
  "12TH_PASS",
  "DIPLOMA",
  "GRADUATE",
  "POST_GRADUATE",
  "BTECH",
  "MBBS",
] as const;
export type JobQualification = (typeof JOB_QUALIFICATIONS)[number];

export const JOB_QUOTAS = ["ALL", "SC", "ST", "GENERAL"] as const;
export type JobQuota = (typeof JOB_QUOTAS)[number];

export const APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Labels for display
export const SECTOR_LABELS: Record<JobSector, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  PSU: "PSU / Public Sector",
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  GOVERNMENT: "Government",
};

export const WORKPLACE_LABELS: Record<WorkplaceType, string> = {
  ON_SITE: "On-Site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export const CATEGORY_LABELS: Record<string, string> = {
  IT: "Information Technology",
  ENGINEERING: "Engineering",
  BANKING: "Banking & Finance",
  HEALTHCARE: "Healthcare",
  GOVERNMENT_PSC: "Government / PSC",
  SKILLED_LABOR: "Skilled Labor / ITI",
  EDUCATION: "Education / Teaching",
  AGRICULTURE: "Agriculture",
  LEGAL: "Legal",
  SOCIAL_SECTOR: "Social Sector / NGO",
  CUSTOMER_SERVICE: "Customer Service",
  OTHER: "Other",
};

export const QUALIFICATION_LABELS: Record<string, string> = {
  ANY: "Any Qualification",
  "10TH_PASS": "10th Pass (SSC)",
  "12TH_PASS": "12th Pass (HSC)",
  DIPLOMA: "Diploma / ITI",
  GRADUATE: "Graduate (Any Stream)",
  POST_GRADUATE: "Post Graduate",
  BTECH: "B.Tech / B.E.",
  MBBS: "MBBS / Medical",
};

export const QUOTA_LABELS: Record<JobQuota, string> = {
  ALL: "Open to All",
  SC: "SC Reserved",
  ST: "ST Reserved",
  GENERAL: "General",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview Scheduled",
  SELECTED: "Selected / Offer Received",
  REJECTED: "Not Selected",
};

// -------------------------------------------------------------------
// Filter Schema
// -------------------------------------------------------------------

export const JobFilterSchema = z.object({
  tab: z.enum(["all", "government", "private", "reserved"]).default("all"),
  search: z.string().optional(),
  sector: z.enum(JOB_SECTORS).optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  qualification: z.string().optional(),
  quota: z.enum(JOB_QUOTAS).optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type JobFilterInput = z.infer<typeof JobFilterSchema>;

// -------------------------------------------------------------------
// Job Application Schema
// -------------------------------------------------------------------

export const JobApplicationInputSchema = z.object({
  jobId: z.string().min(1),
  resumeId: z.string().optional(),
  coverLetter: z.string().max(2000).optional(),
  isExternalTrack: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
});

export type JobApplicationInput = z.infer<typeof JobApplicationInputSchema>;

// -------------------------------------------------------------------
// Application Status Update Schema
// -------------------------------------------------------------------

export const ApplicationStatusUpdateSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(APPLICATION_STATUSES),
  statusNotes: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export type ApplicationStatusUpdate = z.infer<typeof ApplicationStatusUpdateSchema>;

// -------------------------------------------------------------------
// Resume Schema
// -------------------------------------------------------------------

export const ResumeEducationItemSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institute: z.string().min(1, "Institute is required"),
  year: z.string().min(4, "Year is required"),
  marks: z.string().optional(),
});

export const ResumeExperienceItemSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
});

export const ResumeInputSchema = z.object({
  title: z.string().min(1, "Resume title is required").default("Primary Resume"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  phone: z.string().optional(),
  summary: z.string().max(500).optional(),
  qualification: z.string().optional(),
  education: z.array(ResumeEducationItemSchema).default([]),
  experience: z.array(ResumeExperienceItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  experienceYears: z.coerce.number().min(0).optional(),
  isDefault: z.boolean().default(false),
});

export type ResumeInput = z.infer<typeof ResumeInputSchema>;
export type ResumeEducationItem = z.infer<typeof ResumeEducationItemSchema>;
export type ResumeExperienceItem = z.infer<typeof ResumeExperienceItemSchema>;

// -------------------------------------------------------------------
// Employer Registration Schema
// -------------------------------------------------------------------

export const EmployerRegisterSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  companySize: z.string().optional(),
  website: z.string().url("Valid URL required").optional().or(z.literal("")),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
});

export type EmployerRegisterInput = z.infer<typeof EmployerRegisterSchema>;

// -------------------------------------------------------------------
// Job Post Schema (Employer)
// -------------------------------------------------------------------

export const JobPostSchema = z.object({
  title: z.string().min(3, "Job title is required"),
  description: z.string().min(10, "Description is required"),
  requirements: z.string().min(5, "Requirements are required"),
  category: z.string().min(1, "Category is required"),
  sector: z.enum(JOB_SECTORS).default("PRIVATE"),
  jobType: z.enum(JOB_TYPES).default("FULL_TIME"),
  workplaceType: z.enum(WORKPLACE_TYPES).default("ON_SITE"),
  qualification: z.string().default("ANY"),
  quota: z.string().optional(),
  ageRelaxation: z.string().optional(),
  minAge: z.coerce.number().min(18).optional(),
  maxAge: z.coerce.number().max(65).optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().optional(),
  city: z.string().optional(),
  minSalary: z.coerce.number().min(0).optional(),
  maxSalary: z.coerce.number().min(0).optional(),
  isReservedForScSt: z.boolean().default(false),
  targetCommunity: z.enum(["SC", "ST"]).nullable().optional(),
  vacancies: z.coerce.number().min(1).default(1),
  deadline: z.string().min(1, "Application deadline is required"),
  howToApplySteps: z.array(z.string()).default([]),
  officialUrl: z.string().url().optional().or(z.literal("")),
  sourceUrl: z.string().url("Official source URL is required"),
  syllabusUrl: z.string().url().optional().or(z.literal("")),
  admitCardUrl: z.string().url().optional().or(z.literal("")),
  resultUrl: z.string().url().optional().or(z.literal("")),
  isExternal: z.boolean().default(false),
});

export type JobPostInput = z.infer<typeof JobPostSchema>;

// -------------------------------------------------------------------
// Admin Job Schema
// -------------------------------------------------------------------

export const AdminJobInputSchema = JobPostSchema.extend({
  organizationName: z.string().optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "ARCHIVED", "PENDING_APPROVAL"]).default("ACTIVE"),
});

export type AdminJobInput = z.infer<typeof AdminJobInputSchema>;
