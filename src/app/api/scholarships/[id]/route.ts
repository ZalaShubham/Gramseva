import { NextRequest, NextResponse } from "next/server";
import { getScholarshipById } from "@/modules/scholarships/scholarship-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getScholarshipById(id);
    if (!item) {
      return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch scholarship" }, { status: 500 });
  }
}
