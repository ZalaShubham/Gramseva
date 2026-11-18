import { z } from "zod";

export const SCHOLARSHIP_CATEGORIES = [
  "PRE_MATRIC",
  "POST_MATRIC",
  "HIGHER_STUDY",
  "ABROAD",
  "COACHING",
  "HOSTEL",
] as const;

export type ScholarshipCategory = (typeof SCHOLARSHIP_CATEGORIES)[number];

export const CLASS_LEVELS = [
  "CLASS_9_10",
  "CLASS_11_12",
  "DIPLOMA",
  "UG",
  "PG",
  "PHD",
] as const;

export const COURSES = [
  "ALL",
  "GENERAL",
  "STEM",
  "MEDICAL",
  "LAW",
] as const;

export const TRACK_STATUSES = [
  "INTERESTED",
  "APPLIED",
  "RECEIVED",
  "REJECTED",
] as const;

export type TrackStatus = (typeof TRACK_STATUSES)[number];

export const ScholarshipFilterSchema = z.object({
  tab: z.enum(["active", "ended"]).default("active"),
  search: z.string().optional(),
  category: z.string().optional(),
  classLevel: z.string().optional(),
  course: z.string().optional(),
  state: z.string().optional(),
  provider: z.string().optional(),
  community: z.enum(["SC", "ST"]).optional(),
  maxIncome: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type ScholarshipFilterInput = z.infer<typeof ScholarshipFilterSchema>;

export const EligibilityCheckSchema = z.object({
  community: z.enum(["SC", "ST"]),
  classLevel: z.string().min(1, "Class level is required"),
  course: z.string().min(1, "Course is required"),
  state: z.string().min(1, "State is required"),
  annualIncome: z.coerce.number().min(0, "Income must be positive"),
  percentage: z.coerce.number().min(0).max(100).optional(),
});

export type EligibilityCheckInput = z.infer<typeof EligibilityCheckSchema>;

export interface EligibilityResult {
  scholarshipId: string;
  title: string;
  provider: string;
  awardAmount: number;
  deadline: string;
  category: string;
  applicationUrl: string;
  isEligible: boolean;
  matchReasons: string[];
  mismatchReasons: string[];
}

export const ScholarshipTrackInputSchema = z.object({
  scholarshipId: z.string().min(1),
  status: z.enum(TRACK_STATUSES),
  notes: z.string().optional(),
  checklistState: z.record(z.string(), z.boolean()).optional(),
});

export type ScholarshipTrackInput = z.infer<typeof ScholarshipTrackInputSchema>;

export const AdminScholarshipInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  provider: z.string().min(2, "Provider is required"),
  description: z.string().min(10, "Description must be detailed"),
  eligibilityCriteria: z.string().min(5, "Eligibility criteria is required"),
  category: z.enum(SCHOLARSHIP_CATEGORIES),
  course: z.string().default("ALL"),
  classLevel: z.string().default("UG"),
  community: z.enum(["SC", "ST"]).nullable().optional(),
  awardAmount: z.coerce.number().min(0, "Award amount must be non-negative"),
  deadline: z.string().datetime().or(z.string().min(1)),
  state: z.string().nullable().optional(),
  isNational: z.boolean().default(false),
  applicationUrl: z.string().url("Valid application URL is required"),
  sourceUrl: z.string().url("Valid official source URL is required"),
  howToApplySteps: z.array(z.string()).min(1, "At least one application step required"),
  documentsRequired: z.array(z.string()).min(1, "At least one document checklist item required"),
  commonRejectionReasons: z.array(z.string()).default([]),
  status: z.enum(["OPEN", "CLOSED", "UPCOMING"]).default("OPEN"),
  minPercentage: z.coerce.number().min(0).max(100).optional(),
  maxFamilyIncome: z.coerce.number().optional(),
});

export type AdminScholarshipInput = z.infer<typeof AdminScholarshipInputSchema>;
