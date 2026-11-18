import { NextRequest, NextResponse } from "next/server";
import { checkAllScholarshipsEligibility } from "@/modules/scholarships/scholarship-service";
import { EligibilityCheckSchema } from "@/modules/scholarships/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EligibilityCheckSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid eligibility input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const results = await checkAllScholarshipsEligibility(parsed.data);
    return NextResponse.json({
      totalEvaluated: results.length,
      eligibleCount: results.filter((r) => r.isEligible).length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
