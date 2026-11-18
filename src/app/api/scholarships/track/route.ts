import { NextRequest, NextResponse } from "next/server";
import { requireLevel } from "@/lib/auth";
import {
  getUserScholarshipTracks,
  upsertScholarshipTrack,
} from "@/modules/scholarships/scholarship-service";
import { ScholarshipTrackInputSchema } from "@/modules/scholarships/types";

export async function GET() {
  try {
    const user = await requireLevel(1);
    const tracks = await getUserScholarshipTracks(user.id);
    return NextResponse.json({ tracks });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireLevel(1);
    const body = await req.json();

    const parsed = ScholarshipTrackInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tracking data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const record = await upsertScholarshipTrack(user.id, parsed.data);
    return NextResponse.json({ success: true, track: record });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}
