import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { listScholarships } from "@/modules/scholarships/scholarship-service";
import { ScholarshipSubnav } from "@/modules/scholarships/components/scholarship-subnav";
import { DeadlineCalendarView } from "@/modules/scholarships/components/deadline-calendar-view";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface CalendarPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ScholarshipCalendarPage({ params }: CalendarPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "scholarships.calendar" });
  const currentUser = await getCurrentUser();

  const { items } = await listScholarships({
    tab: "active",
    limit: 100,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <ScholarshipSubnav currentUser={currentUser} />

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Timeline & Automated Alerts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <DeadlineCalendarView scholarships={items} currentUser={currentUser} />
    </div>
  );
}
