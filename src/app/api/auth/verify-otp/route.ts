import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpProvider';
import { createSession } from '@/lib/auth';

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string, otp: string }
 * Verifies the OTP and, on success, creates a session cookie.
 */
export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: 'phone and otp are required' }, { status: 400 });
    }
    const ok = await verifyOtp(phone, otp);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }
    // OTP succeeded – create a session for the user (user may already exist or be created elsewhere)
    // For simplicity we assume a User entry exists with this phone number. If not, you may create one here.
    const token = await createSession(phone); // using phone as userId placeholder – adjust as needed
    // The session cookie is set inside createSession via Next.js cookies API.
    return NextResponse.json({ message: 'Authenticated', token }, { status: 200 });
  } catch (err: any) {
    console.error('verify-otp error', err);
    return NextResponse.json({ error: err?.message || 'Failed to verify OTP' }, { status: 500 });
  }
}
