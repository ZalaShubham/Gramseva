import { NextResponse } from "next/server";
import { requireLevel } from "@/lib/auth";
import { generateDeadlineNotifications } from "@/modules/scholarships/scholarship-service";

export async function POST() {
  try {
    const user = await requireLevel(1);
    const notifications = await generateDeadlineNotifications(user.id);
    return NextResponse.json({
      success: true,
      generatedCount: notifications.length,
      notifications,
    });
  } catch (err: any) {
    const status = err.status || 403;
    return NextResponse.json({ error: err.message }, { status });
  }
}
