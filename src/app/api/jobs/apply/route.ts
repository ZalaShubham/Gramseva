import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { applyToJob, trackExternalJob } from "@/modules/jobs/job-service";
import { JobApplicationInputSchema } from "@/modules/jobs/types";

export async function POST(req: NextRequest) {
  try {
    const user = await requireLevel(2);
    const body = await req.json();

    const parsed = JobApplicationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    let record;
    if (parsed.data.isExternalTrack) {
      record = await trackExternalJob(user.id, parsed.data);
    } else {
      record = await applyToJob(user.id, parsed.data);
    }
    return NextResponse.json(record, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}