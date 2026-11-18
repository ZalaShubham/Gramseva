import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { getJobApplications, getEmployerJobs } from "@/modules/jobs/job-service";

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole("EMPLOYER");
    const jobId = req.nextUrl.searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }
    const apps = await getJobApplications(user.id, jobId);
    return NextResponse.json({ items: apps, total: apps.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}