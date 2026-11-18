import { PrismaClient } from "@prisma/client";
import {
  SEED_TEST_USERS,
  SEED_RELATION_TYPES,
  SEED_POLITICIANS,
  SEED_JOBS,
  SEED_SCHOLARSHIPS,
} from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Gramseva database seed...");

  // 1. Seed Relation Types
  console.log("-> Seeding Relation Types with inverse connections...");
  for (const rel of SEED_RELATION_TYPES) {
    await prisma.relationType.upsert({
      where: { code: rel.code },
      update: {
        nameEn: rel.nameEn,
        nameGu: rel.nameGu,
        nameHi: rel.nameHi,
        inverseRelationCode: rel.inverseRelationCode,
        isSymmetric: rel.isSymmetric,
      },
      create: {
        code: rel.code,
        nameEn: rel.nameEn,
        nameGu: rel.nameGu,
        nameHi: rel.nameHi,
        inverseRelationCode: rel.inverseRelationCode,
        isSymmetric: rel.isSymmetric,
      },
    });
  }

  // 2. Seed 6 Core Test Users (representing each role and level)
  console.log("-> Seeding 6 Test Users (Levels 0, 1, 2 and Roles)...");
  for (const user of SEED_TEST_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        level: user.level,
        community: user.community ?? undefined,
        subCaste: user.subCaste,
        state: user.state,
        district: user.district,
        isPhoneVerified: user.isPhoneVerified,
        verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : null,
      },
      create: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        level: user.level,
        community: user.community ?? undefined,
        subCaste: user.subCaste,
        state: user.state,
        district: user.district,
        isPhoneVerified: user.isPhoneVerified,
        verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : null,
      },
    });
  }

  // 3. Seed Employer Profile for employer test user
  const employerUser = SEED_TEST_USERS.find((u) => u.role === "EMPLOYER");
  let employerRecordId = "emp-profile-001";
  if (employerUser) {
    const emp = await prisma.employer.upsert({
      where: { userId: employerUser.id },
      update: {
        companyName: "Ashoka Tech Solutions",
        industry: "Information Technology",
        companySize: "50-200",
        state: "Gujarat",
        city: "Vadodara",
        verifiedCompany: true,
      },
      create: {
        id: employerRecordId,
        userId: employerUser.id,
        companyName: "Ashoka Tech Solutions",
        industry: "Information Technology",
        companySize: "50-200",
        state: "Gujarat",
        city: "Vadodara",
        verifiedCompany: true,
      },
    });
    employerRecordId = emp.id;
  }

  // 4. Seed 10 Politicians
  console.log("-> Seeding 10 Politician profiles with works and announcements...");
  for (const pol of SEED_POLITICIANS) {
    // Ensure corresponding user exists
    await prisma.user.upsert({
      where: { id: pol.userId },
      update: {
        name: pol.name,
        role: "POLITICIAN",
        level: 2,
        state: pol.state,
        district: pol.district,
        isPhoneVerified: true,
      },
      create: {
        id: pol.userId,
        name: pol.name,
        email: pol.contactEmail,
        phone: pol.contactPhone,
        role: "POLITICIAN",
        level: 2,
        state: pol.state,
        district: pol.district,
        isPhoneVerified: true,
      },
    });

    await prisma.politician.upsert({
      where: { id: pol.id },
      update: {
        userId: pol.userId,
        constituency: pol.constituency,
        constituencyType: pol.constituencyType,
        party: pol.party,
        designation: pol.designation,
        state: pol.state,
        district: pol.district,
        reservedSeat: pol.reservedSeat,
        termStart: new Date(pol.termStart),
        termEnd: new Date(pol.termEnd),
        bio: pol.bio,
        officeAddress: pol.officeAddress,
        contactEmail: pol.contactEmail,
        contactPhone: pol.contactPhone,
        bannerUrl: pol.bannerUrl,
        isVerified: pol.isVerified,
      },
      create: {
        id: pol.id,
        userId: pol.userId,
        constituency: pol.constituency,
        constituencyType: pol.constituencyType,
        party: pol.party,
        designation: pol.designation,
        state: pol.state,
        district: pol.district,
        reservedSeat: pol.reservedSeat,
        termStart: new Date(pol.termStart),
        termEnd: new Date(pol.termEnd),
        bio: pol.bio,
        officeAddress: pol.officeAddress,
        contactEmail: pol.contactEmail,
        contactPhone: pol.contactPhone,
        bannerUrl: pol.bannerUrl,
        isVerified: pol.isVerified,
      },
    });
  }

  // 5. Seed 20 Jobs
  console.log("-> Seeding 20 Job postings...");
  for (const job of SEED_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        employerId: employerRecordId,
        title: job.title,
        description: job.description,
        requirements: "Relevant educational background, problem solving, teamwork, community focus.",
        category: job.category,
        jobType: job.jobType,
        workplaceType: job.workplaceType,
        state: job.state,
        district: job.district,
        city: job.city,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        isReservedForScSt: job.isReservedForScSt,
        targetCommunity: job.targetCommunity ?? undefined,
        vacancies: job.vacancies,
        deadline: new Date(job.deadline),
        isActive: true,
      },
      create: {
        id: job.id,
        employerId: employerRecordId,
        title: job.title,
        description: job.description,
        requirements: "Relevant educational background, problem solving, teamwork, community focus.",
        category: job.category,
        jobType: job.jobType,
        workplaceType: job.workplaceType,
        state: job.state,
        district: job.district,
        city: job.city,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        isReservedForScSt: job.isReservedForScSt,
        targetCommunity: job.targetCommunity ?? undefined,
        vacancies: job.vacancies,
        deadline: new Date(job.deadline),
        isActive: true,
      },
    });
  }

  // 6. Seed 20 Scholarships
  console.log("-> Seeding 20 Scholarships...");
  for (const sch of SEED_SCHOLARSHIPS) {
    await prisma.scholarship.upsert({
      where: { id: sch.id },
      update: {
        title: sch.title,
        provider: sch.provider,
        description: sch.description,
        eligibilityCriteria: `Minimum ${sch.minPercentage ?? 50}% marks in previous examination. Family income under ₹${sch.maxFamilyIncome ? (sch.maxFamilyIncome / 100000).toFixed(1) + "L" : "N/A"}.`,
        community: sch.community ?? undefined,
        minPercentage: sch.minPercentage,
        maxFamilyIncome: sch.maxFamilyIncome,
        educationLevel: sch.educationLevel || sch.classLevel || "UNDERGRADUATE",
        category: sch.category,
        course: sch.course,
        classLevel: sch.classLevel,
        awardAmount: sch.awardAmount,
        deadline: new Date(sch.deadline),
        applicationUrl: sch.applicationUrl,
        sourceUrl: sch.sourceUrl,
        howToApplySteps: sch.howToApplySteps,
        documentsRequired: sch.documentsRequired,
        commonRejectionReasons: sch.commonRejectionReasons,
        lastVerifiedAt: new Date(sch.lastVerifiedAt),
        state: sch.state,
        isNational: sch.isNational,
        status: sch.status === "CLOSED" ? "CLOSED" : "OPEN",
      },
      create: {
        id: sch.id,
        title: sch.title,
        provider: sch.provider,
        description: sch.description,
        eligibilityCriteria: `Minimum ${sch.minPercentage ?? 50}% marks in previous examination. Family income under ₹${sch.maxFamilyIncome ? (sch.maxFamilyIncome / 100000).toFixed(1) + "L" : "N/A"}.`,
        community: sch.community ?? undefined,
        minPercentage: sch.minPercentage,
        maxFamilyIncome: sch.maxFamilyIncome,
        educationLevel: sch.educationLevel || sch.classLevel || "UNDERGRADUATE",
        category: sch.category,
        course: sch.course,
        classLevel: sch.classLevel,
        awardAmount: sch.awardAmount,
        deadline: new Date(sch.deadline),
        applicationUrl: sch.applicationUrl,
        sourceUrl: sch.sourceUrl,
        howToApplySteps: sch.howToApplySteps,
        documentsRequired: sch.documentsRequired,
        commonRejectionReasons: sch.commonRejectionReasons,
        lastVerifiedAt: new Date(sch.lastVerifiedAt),
        state: sch.state,
        isNational: sch.isNational,
        status: sch.status === "CLOSED" ? "CLOSED" : "OPEN",
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
