import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { updateResume, deleteResume } from "@/modules/jobs/job-service";
import { ResumeInputSchema } from "@/modules/jobs/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(1);
    const { id } = await params;
    const body = await req.json();
    const partial = ResumeInputSchema.partial().safeParse(body);
    if (!partial.success) {
      return NextResponse.json({ error: "Invalid input", details: partial.error.format() }, { status: 400 });
    }
    const updated = await updateResume(user.id, id, partial.data);
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(1);
    const { id } = await params;
    await deleteResume(user.id, id);
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}