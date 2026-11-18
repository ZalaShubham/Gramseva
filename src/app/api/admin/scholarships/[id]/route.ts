import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
  updateScholarship,
  archiveScholarship,
} from "@/modules/scholarships/scholarship-service";
import { AdminScholarshipInputSchema } from "@/modules/scholarships/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole("ADMIN");
    const { id } = await params;
    const body = await req.json();

    const parsed = AdminScholarshipInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateScholarship(id, parsed.data, admin.id);
    return NextResponse.json({ success: true, scholarship: updated });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole("ADMIN");
    const { id } = await params;

    const archived = await archiveScholarship(id, admin.id);
    return NextResponse.json({
      success: true,
      message: "Scholarship archived successfully",
      scholarship: archived,
    });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}
