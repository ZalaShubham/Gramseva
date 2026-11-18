import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { saveJob, unsaveJob, isJobSaved } from "@/modules/jobs/job-service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(1);
    const { id: jobId } = await params;
    await saveJob(user.id, jobId);
    return NextResponse.json({ saved: true });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(1);
    const { id: jobId } = await params;
    await unsaveJob(user.id, jobId);
    return NextResponse.json({ saved: false });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(1);
    const { id: jobId } = await params;
    const saved = await isJobSaved(user.id, jobId);
    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ saved: false });
  }
}