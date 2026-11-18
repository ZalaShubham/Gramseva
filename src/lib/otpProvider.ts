// src/lib/otpProvider.ts
// OTP Provider abstraction for Phase 7.
// Supports Firebase Auth (default) and a stub for MSG91.
// Uses the OtpAttempt Prisma model for rate‑limiting & lock‑out.

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * Configuration via environment variables:
 *   OTP_PROVIDER: "firebase" | "msg91" (defaults to "firebase")
 *   OTP_EXPIRY_MINUTES: number of minutes an OTP is valid (default 10)
 *   OTP_MAX_ATTEMPTS: number of verification attempts before lockout (default 5)
 */
const OTP_PROVIDER = process.env.OTP_PROVIDER ?? "firebase";
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

// ----- Firebase implementation (requires firebase-admin) -----
let firebaseAdmin: any = null;
if (OTP_PROVIDER === "firebase") {
  try {
    // Dynamic import to avoid loading when not needed.
    firebaseAdmin = require("firebase-admin");
    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
        ),
      });
    }
  } catch (e) {
    console.warn("Firebase admin not available; OTP will fall back to stub.");
    firebaseAdmin = null;
  }
}

/** Helper to generate a numeric 6‑digit OTP. */
function generateOtp(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

/** Helper to hash OTP before persisting. */
function hashOtp(otp: string): string {
  // Use SHA‑256; in production you may want bcrypt.
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** Create a new OTP record and send the code via the selected provider. */
export async function sendOtp(phone: string): Promise<void> {
  const otp = generateOtp();
  const hash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

  // Invalidate any previous pending OTPs for this phone.
  await prisma.otpAttempt.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  await prisma.otpAttempt.create({
    data: { phone, otpHash: hash, expiresAt },
  });

  // Dispatch the OTP.
  if (OTP_PROVIDER === "firebase" && firebaseAdmin) {
    // Firebase Phone Auth requires a verificationId flow that involves the client SDK.
    // Here we use the admin SDK to create a custom token that the client can exchange.
    // For a pure SMS OTP you would normally use a third‑party SMS service.
    await firebaseAdmin.auth().createUser({ phoneNumber: phone }).catch(() => {});
    // Stub: simply log – real implementation would call an SMS gateway.
    console.log(`Firebase OTP for ${phone}: ${otp}`);
  } else if (OTP_PROVIDER === "msg91") {
    // TODO: integrate MSG91 SDK / HTTP API.
    console.log(`MSG91 OTP for ${phone}: ${otp}`);
  } else {
    // Fallback stub – print to console for local dev.
    console.log(`OTP for ${phone}: ${otp}`);
  }
}

/** Verify an OTP. Returns the associated phone if successful. */
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
    // Lock out further attempts – caller should request a new OTP.
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
