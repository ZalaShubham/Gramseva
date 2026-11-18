import { NextRequest, NextResponse } from "next/server";
import { requireLevel, AuthError } from "@/lib/auth";
import { updateApplicationStatus } from "@/modules/jobs/job-service";
import { ApplicationStatusUpdateSchema } from "@/modules/jobs/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireLevel(2);
    const { id } = await params;
    const body = await req.json();

    const parsed = ApplicationStatusUpdateSchema.safeParse({ ...body, applicationId: id });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const updated = await updateApplicationStatus(user.id, parsed.data);
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}