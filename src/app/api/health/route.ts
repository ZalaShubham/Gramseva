import { NextResponse } from "next/server";

export async function GET() {
  const uptimeSeconds = process.uptime();

  return NextResponse.json(
    {
      status: "operational",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptimeSeconds)} seconds`,
      environment: process.env.NODE_ENV || "development",
      services: {
        web: "healthy",
        auth: "healthy",
        i18n: ["gu", "hi", "en"],
        database: process.env.DATABASE_URL ? "configured" : "unconfigured",
      },
    },
    { status: 200 }
  );
}
