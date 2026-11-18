import { NextRequest, NextResponse } from "next/server";
import { listScholarships } from "@/modules/scholarships/scholarship-service";
import { ScholarshipFilterSchema } from "@/modules/scholarships/types";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawFilters = {
      tab: searchParams.get("tab") || "active",
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      classLevel: searchParams.get("classLevel") || undefined,
      course: searchParams.get("course") || undefined,
      state: searchParams.get("state") || undefined,
      provider: searchParams.get("provider") || undefined,
      community: searchParams.get("community") || undefined,
      maxIncome: searchParams.get("maxIncome") ? Number(searchParams.get("maxIncome")) : undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };

    const parsed = ScholarshipFilterSchema.safeParse(rawFilters);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid filters", details: parsed.error.format() }, { status: 400 });
    }

    const data = await listScholarships(parsed.data);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch scholarships" }, { status: 500 });
  }
}
