import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createScholarship } from "@/modules/scholarships/scholarship-service";
import { AdminScholarshipInputSchema } from "@/modules/scholarships/types";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole("ADMIN");
    const body = await req.json();

    const parsed = AdminScholarshipInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const created = await createScholarship(parsed.data, admin.id);
    return NextResponse.json({ success: true, scholarship: created }, { status: 201 });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}
