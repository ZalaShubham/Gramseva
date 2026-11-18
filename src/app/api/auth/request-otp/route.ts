import { NextResponse } from 'next/server';
import { sendOtp } from '@/lib/otpProvider';

/**
 * POST /api/auth/request-otp
 * Body: { phone: string }
 * Sends an OTP to the given phone number using the configured provider.
 */
export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    await sendOtp(phone);
    return NextResponse.json({ message: 'OTP sent' }, { status: 200 });
  } catch (err: any) {
    console.error('request-otp error', err);
    return NextResponse.json({ error: err?.message || 'Failed to send OTP' }, { status: 500 });
  }
}
