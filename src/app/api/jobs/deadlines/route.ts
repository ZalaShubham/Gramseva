import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { generateJobDeadlineNotifications, getInMemoryJobNotifications } from "@/modules/jobs/job-service";

export async function POST(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const notifs = await generateJobDeadlineNotifications(user.id);
    return NextResponse.json({ count: notifs.length, notifications: notifs });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const notifs = getInMemoryJobNotifications(user.id);
    return NextResponse.json({ items: notifs, total: notifs.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}