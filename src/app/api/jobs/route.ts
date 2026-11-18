import { NextRequest, NextResponse } from "next/server";
import { listJobs } from "@/modules/jobs/job-service";
import { JobFilterSchema } from "@/modules/jobs/types";
import { getCurrentUser } from "@/lib/auth";
import { getMyResumes } from "@/modules/jobs/job-service";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const raw = {
      tab: sp.get("tab") || "all",
      search: sp.get("search") || undefined,
      sector: sp.get("sector") || undefined,
      jobType: sp.get("jobType") || undefined,
      qualification: sp.get("qualification") || undefined,
      quota: sp.get("quota") || undefined,
      state: sp.get("state") || undefined,
      category: sp.get("category") || undefined,
      page: sp.get("page") ? Number(sp.get("page")) : 1,
      limit: sp.get("limit") ? Number(sp.get("limit")) : 10,
    };

    const parsed = JobFilterSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid filters", details: parsed.error.format() }, { status: 400 });
    }

    // Load user qualification for smart sorting
    const currentUser = await getCurrentUser();
    let userQualification: string | null = null;
    if (currentUser) {
      const resumes = await getMyResumes(currentUser.id);
      const defaultResume = resumes.find((r) => r.isDefault) ?? resumes[0];
      userQualification = defaultResume?.qualification ?? null;
    }

    const data = await listJobs(parsed.data, userQualification);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch jobs" }, { status: 500 });
  }
}
