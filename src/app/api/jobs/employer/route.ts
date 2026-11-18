import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { registerEmployer, getEmployerProfile } from "@/modules/jobs/job-service";
import { EmployerRegisterSchema } from "@/modules/jobs/types";

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole("EMPLOYER");
    const profile = await getEmployerProfile(user.id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole("EMPLOYER");
    const body = await req.json();
    const parsed = EmployerRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }
    const employer = await registerEmployer(user.id, parsed.data);
    return NextResponse.json(employer, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}