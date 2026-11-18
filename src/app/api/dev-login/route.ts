import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEV_USER_COOKIE_NAME, getCurrentUser } from "@/lib/auth";
import { SEED_TEST_USERS } from "@/lib/seed-data";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev login is disabled in production" }, { status: 403 });
  }

  const currentUser = await getCurrentUser();
  return NextResponse.json({
    currentUser,
    availableUsers: SEED_TEST_USERS,
  });
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev login is disabled in production" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId } = body;
    const cookieStore = await cookies();

    if (!userId) {
      // Clear session (reset to Level 0 Visitor)
      cookieStore.delete(DEV_USER_COOKIE_NAME);
      return NextResponse.json({
        success: true,
        message: "Switched to Level 0 Public Visitor",
        user: null,
      });
    }

    const targetUser = SEED_TEST_USERS.find((u) => u.id === userId);
    if (!targetUser) {
      return NextResponse.json({ error: "Invalid test user ID" }, { status: 400 });
    }

    // Set cookie for 7 days
    cookieStore.set(DEV_USER_COOKIE_NAME, targetUser.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false, // Accessible to client if needed
    });

    return NextResponse.json({
      success: true,
      message: `Signed in as ${targetUser.name} (${targetUser.role}, L${targetUser.level})`,
      user: targetUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to switch user" }, { status: 500 });
  }
}
