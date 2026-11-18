import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { adminCreateJob, adminListAllJobs, adminListExpiredJobs } from "@/modules/jobs/job-service";
import { AdminJobInputSchema } from "@/modules/jobs/types";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["ADMIN", "MODERATOR"]);
    const showExpired = req.nextUrl.searchParams.get("expired") === "true";
    const jobs = showExpired ? await adminListExpiredJobs() : await adminListAllJobs(true);
    return NextResponse.json({ items: jobs, total: jobs.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(["ADMIN", "MODERATOR"]);
    const body = await req.json();
    const parsed = AdminJobInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }
    const job = await adminCreateJob(parsed.data);
    return NextResponse.json(job, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}