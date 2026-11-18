import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { postJob, getEmployerJobs } from "@/modules/jobs/job-service";
import { JobPostSchema } from "@/modules/jobs/types";

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole("EMPLOYER");
    const jobs = await getEmployerJobs(user.id);
    return NextResponse.json({ items: jobs, total: jobs.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole("EMPLOYER");
    const body = await req.json();
    const parsed = JobPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }
    const job = await postJob(user.id, parsed.data);
    return NextResponse.json(job, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}