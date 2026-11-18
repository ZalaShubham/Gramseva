import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { getMyApplications } from "@/modules/jobs/job-service";

export async function GET(req: NextRequest) {
  try {
    const user = await requireLevel(2);
    const apps = await getMyApplications(user.id);
    return NextResponse.json({ items: apps, total: apps.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}