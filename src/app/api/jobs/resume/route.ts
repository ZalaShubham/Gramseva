import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { saveResume, getMyResumes } from "@/modules/jobs/job-service";
import { ResumeInputSchema } from "@/modules/jobs/types";

export async function GET(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const resumes = await getMyResumes(user.id);
    return NextResponse.json({ items: resumes });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const body = await req.json();

    const parsed = ResumeInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const resume = await saveResume(user.id, parsed.data);
    return NextResponse.json(resume, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}