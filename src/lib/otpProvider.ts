// src/lib/otpProvider.ts
// OTP Provider abstraction for Phase 7.
// Currently uses **Firebase Admin SDK** only (default).
// Uses the OtpAttempt Prisma model for rate‑limiting & lock‑out.

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * Configuration via environment variables:
 *   OTP_PROVIDER: "firebase" (forced) – other providers are not used.
 *   OTP_EXPIRY_MINUTES: number of minutes an OTP is valid (default 10)
 *   OTP_MAX_ATTEMPTS: number of verification attempts before lockout (default 5)
 */
const OTP_PROVIDER = "firebase"; // force firebase only
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

// ----- Firebase implementation (requires firebase-admin) -----
let firebaseAdmin: any = null;
try {
  firebaseAdmin = require("firebase-admin");
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
    });
  }
} catch (e) {
  console.warn("Firebase admin not available – OTP will fallback to console stub.");
  firebaseAdmin = null;
}

/** Helper to generate a numeric 6‑digit OTP. */
function generateOtp(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

/** Helper to hash OTP before persisting. */
function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** Create a new OTP record and send the code via Firebase (or console stub). */
export async function sendOtp(phone: string): Promise<void> {
  // Basic validation – Indian 10‑digit number (can be adjusted).
  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Invalid Indian mobile number");
  }

  // Enforce resend cooldown: max one OTP per minute per phone.
  const recent = await prisma.otpAttempt.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
  if (recent && recent.createdAt > new Date(Date.now() - 60 * 1000)) {
    throw new Error("Please wait before requesting another OTP");
  }

  const otp = generateOtp();
  const hash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

  // Invalidate any previous pending OTPs for this phone.
  await prisma.otpAttempt.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  // Persist OTP attempt (no providerSessionId needed).
  await prisma.otpAttempt.create({
    data: { phone, otpHash: hash, expiresAt },
  });

  // Dispatch the OTP.
  if (firebaseAdmin) {
    // Create a placeholder Firebase user (idempotent).
    await firebaseAdmin.auth().createUser({ phoneNumber: phone }).catch(() => {});
    // In a real app you would trigger Firebase Phone Auth here.
    if (process.env.NODE_ENV !== "production") {
      console.log(`Firebase OTP for ${phone}: ${otp}`);
    }
  } else {
    // Console stub for local development.
    console.log(`OTP for ${phone}: ${otp}`);
  }
}

/** Verify an OTP. Returns true if verification succeeded. */
export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const record = await prisma.otpAttempt.findFirst({
    where: {
      phone,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("No active OTP found or OTP expired.");
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.otpAttempt.update({
      where: { id: record.id },
      data: { verified: true },
    });
    throw new Error("Maximum verification attempts exceeded. Request a new OTP.");
  }

  const isMatch = record.otpHash === hashOtp(otp);

  if (!isMatch) {
    await prisma.otpAttempt.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  // Mark as verified to prevent reuse.
  await prisma.otpAttempt.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return true;
}

/** Utility to clean up old OTPs (can be run as a scheduled job). */
export async function purgeExpiredOtps(): Promise<void> {
  await prisma.otpAttempt.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
