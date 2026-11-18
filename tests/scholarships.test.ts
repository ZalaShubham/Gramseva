import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkScholarshipEligibility,
  checkDeadlineAlertThreshold,
  generateDeadlineNotifications,
  upsertScholarshipTrack,
  listScholarships,
  getInMemoryNotifications,
} from "../src/modules/scholarships/scholarship-service";
import { SeedScholarship } from "../src/lib/seed-data";
import { requireLevel, requireRole, AuthError } from "../src/lib/auth";

const mockSampleScholarship: SeedScholarship = {
  id: "test-sch-001",
  title: "Test SC Post-Matric Scholarship",
  provider: "Department of Social Justice",
  educationLevel: "UNDERGRADUATE",
  category: "POST_MATRIC",
  course: "GENERAL",
  classLevel: "UG",
  community: "SC",
  awardAmount: 50000,
  deadline: "2026-12-31T23:59:59.000Z",
  state: "Gujarat",
  isNational: false,
  minPercentage: 55,
  maxFamilyIncome: 250000,
  description: "Test scheme for SC students",
  applicationUrl: "https://digitalgujarat.gov.in",
  sourceUrl: "https://sje.gujarat.gov.in/schemes/test",
  howToApplySteps: ["Step 1", "Step 2"],
  documentsRequired: ["Caste Certificate", "Income Certificate"],
  commonRejectionReasons: ["Income ceiling exceeded"],
  lastVerifiedAt: "2026-10-01T00:00:00.000Z",
  status: "OPEN",
};

describe("Phase 1: Scholarship Eligibility Checker Business Rules", () => {
  it("Candidate matching all criteria is flagged eligible with positive match reasons", () => {
    const result = checkScholarshipEligibility(mockSampleScholarship, {
      community: "SC",
      classLevel: "UG",
      course: "GENERAL",
      state: "Gujarat",
      annualIncome: 180000,
      percentage: 65,
    });

    assert.equal(result.isEligible, true);
    assert.equal(result.mismatchReasons.length, 0);
    assert.ok(result.matchReasons.some((r) => r.includes("Matches applicant's SC category")));
    assert.ok(result.matchReasons.some((r) => r.includes("Family income ₹1,80,000 is within")));
    assert.ok(result.matchReasons.some((r) => r.includes("meets or exceeds 55% benchmark")));
  });

  it("Candidate exceeding income ceiling is flagged ineligible with exact income mismatch reason", () => {
    const result = checkScholarshipEligibility(mockSampleScholarship, {
      community: "SC",
      classLevel: "UG",
      course: "GENERAL",
      state: "Gujarat",
      annualIncome: 350000, // Exceeds 250000
      percentage: 65,
    });

    assert.equal(result.isEligible, false);
    assert.ok(result.mismatchReasons.some((r) => r.includes("exceeds scheme ceiling of ₹2,50,000")));
  });

  it("Candidate from different community category is flagged ineligible with category reason", () => {
    const result = checkScholarshipEligibility(mockSampleScholarship, {
      community: "ST", // Scheme is SC
      classLevel: "UG",
      course: "GENERAL",
      state: "Gujarat",
      annualIncome: 150000,
      percentage: 60,
    });

    assert.equal(result.isEligible, false);
    assert.ok(result.mismatchReasons.some((r) => r.includes("reserved exclusively for SC")));
  });

  it("Candidate below minimum academic percentage is flagged ineligible with cutoff reason", () => {
    const result = checkScholarshipEligibility(mockSampleScholarship, {
      community: "SC",
      classLevel: "UG",
      course: "GENERAL",
      state: "Gujarat",
      annualIncome: 150000,
      percentage: 50, // Below 55% cutoff
    });

    assert.equal(result.isEligible, false);
    assert.ok(result.mismatchReasons.some((r) => r.includes("below mandatory 55% cutoff")));
  });
});

describe("Phase 1: Deadline Alert Calculation & Notification Logic", () => {
  it("Correctly identifies 7-day, 3-day, and 1-day alert thresholds", () => {
    const baseDate = new Date("2026-11-01T00:00:00.000Z");

    // 1-day away deadline
    const deadline1d = new Date("2026-11-02T00:00:00.000Z");
    const check1d = checkDeadlineAlertThreshold(deadline1d, baseDate);
    assert.equal(check1d.is1DayAlert, true);
    assert.equal(check1d.is3DayAlert, false);

    // 3-day away deadline
    const deadline3d = new Date("2026-11-04T00:00:00.000Z");
    const check3d = checkDeadlineAlertThreshold(deadline3d, baseDate);
    assert.equal(check3d.is3DayAlert, true);
    assert.equal(check3d.is1DayAlert, false);

    // 7-day away deadline
    const deadline7d = new Date("2026-11-07T00:00:00.000Z");
    const check7d = checkDeadlineAlertThreshold(deadline7d, baseDate);
    assert.equal(check7d.is7DayAlert, true);
    assert.equal(check7d.is3DayAlert, false);
  });

  it("Generates Notification records when deadline is within alert threshold for tracked items", async () => {
    const testUserId = "user-otp-002"; // Level 1 test citizen
    await upsertScholarshipTrack(testUserId, {
      scholarshipId: "sch-001",
      status: "INTERESTED",
    });

    // Simulate current date being 3 days before sch-001's deadline (2026-11-27 for 2026-11-30 deadline)
    const simulatedDate = new Date("2026-11-27T12:00:00.000Z");
    const notifs = await generateDeadlineNotifications(testUserId, simulatedDate);

    assert.ok(Array.isArray(notifs));
    const userNotifs = getInMemoryNotifications(testUserId);
    assert.ok(userNotifs.length > 0);
    assert.equal(userNotifs[0].userId, testUserId);
    assert.equal(userNotifs[0].type, "SCHOLARSHIP");
  });
});

describe("Phase 1: Permission Enforcement", () => {
  it("Public browsing allows Level 0 access without authentication", async () => {
    const list = await listScholarships({ tab: "active", page: 1, limit: 5 });
    assert.ok(list.items.length > 0);
  });

  it("requireLevel(1) throws UNAUTHENTICATED when called without user session", async () => {
    await assert.rejects(
      async () => {
        await requireLevel(1);
      },
      (err: unknown) => {
        assert(err instanceof AuthError);
        assert.equal(err.code, "UNAUTHENTICATED");
        return true;
      }
    );
  });

  it("requireRole('ADMIN') throws UNAUTHENTICATED when session is empty", async () => {
    await assert.rejects(
      async () => {
        await requireRole("ADMIN");
      },
      (err: unknown) => {
        assert(err instanceof AuthError);
        assert.equal(err.code, "UNAUTHENTICATED");
        return true;
      }
    );
  });
});
