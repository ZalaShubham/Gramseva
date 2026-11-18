import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { adminGetAllEmployers, adminGetPendingEmployers } from "@/modules/jobs/job-service";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["ADMIN", "MODERATOR"]);
    const pendingOnly = req.nextUrl.searchParams.get("pending") === "true";
    const employers = pendingOnly
      ? await adminGetPendingEmployers()
      : await adminGetAllEmployers();
    return NextResponse.json({ items: employers, total: employers.length });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}