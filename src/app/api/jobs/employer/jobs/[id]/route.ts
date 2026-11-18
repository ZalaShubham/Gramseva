import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { updateEmployerJob } from "@/modules/jobs/job-service";
import { JobPostSchema } from "@/modules/jobs/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("EMPLOYER");
    const { id } = await params;
    const body = await req.json();
    const parsed = JobPostSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }
    const job = await updateEmployerJob(user.id, id, parsed.data);
    return NextResponse.json(job);
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}