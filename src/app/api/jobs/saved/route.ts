import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { getSavedJobs } from "@/modules/jobs/job-service";

export async function GET(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const jobs = await getSavedJobs(user.id);
    return NextResponse.json({ items: jobs, total: jobs.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}