import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { adminApproveEmployer, adminRejectEmployer } from "@/modules/jobs/job-service";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN", "MODERATOR"]);
    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "approve" | "reject"

    if (action === "approve") {
      await adminApproveEmployer(id);
      return NextResponse.json({ approved: true });
    } else if (action === "reject") {
      await adminRejectEmployer(id);
      return NextResponse.json({ rejected: true });
    }
    return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}