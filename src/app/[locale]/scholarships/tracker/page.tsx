import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { requireLevel } from "@/lib/auth";
import { getUserScholarshipTracks } from "@/modules/scholarships/scholarship-service";
import { ScholarshipSubnav } from "@/modules/scholarships/components/scholarship-subnav";
import {
  BookmarkCheck,
  IndianRupee,
  Building2,
  ArrowRight,
  Inbox,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface TrackerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ScholarshipTrackerPage({ params }: TrackerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "scholarships" });

  let user;
  try {
    user = await requireLevel(1);
  } catch {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ScholarshipSubnav currentUser={null} />
        <div className="rounded-3xl border border-violet-200 bg-violet-50/60 p-8 text-center dark:border-violet-900/40 dark:bg-violet-950/20">
          <BookmarkCheck className="mx-auto h-12 w-12 text-violet-600 dark:text-violet-400 mb-3" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {t("authNotice.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            {t("authNotice.description")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/auth/dev-login"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700"
            >
              Sign In with Dev Switcher
            </Link>
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Browse Schemes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tracks = await getUserScholarshipTracks(user.id);

  const statuses = [
    { key: "INTERESTED", label: t("status.interested"), color: "bg-blue-100 text-blue-800" },
    { key: "APPLIED", label: t("status.applied"), color: "bg-amber-100 text-amber-800" },
    { key: "RECEIVED", label: t("status.received"), color: "bg-emerald-100 text-emerald-800" },
    { key: "REJECTED", label: t("status.rejected"), color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <ScholarshipSubnav currentUser={user} />

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 mb-2">
          <BookmarkCheck className="h-3.5 w-3.5" />
          <span>Level 1 Verified Citizen • Application Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
          {t("nav.tracker")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Monitor your tracked schemes, document checklist progress, and submission milestones.
        </p>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <Inbox className="h-10 w-10 text-zinc-400 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            No scholarships tracked yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm mb-4">
            Browse through active schemes and save them to your tracker to monitor deadlines and documents.
          </p>
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
          >
            <span>Browse Active Schemes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {statuses.map((st) => {
            const items = tracks.filter((t) => t.status === st.key);
            if (items.length === 0) return null;

            return (
              <div
                key={st.key}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${st.color}`}>
                      {st.label}
                    </span>
                    <span className="text-xs text-zinc-500">
                      ({items.length} {items.length === 1 ? "scheme" : "schemes"})
                    </span>
                  </div>
                </div>

                <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {items.map((item) => {
                    const sch = item.scholarship;
                    const tickedDocs = Object.values(item.checklistState || {}).filter(Boolean).length;
                    const totalDocs = sch?.documentsRequired?.length || 0;

                    return (
                      <div
                        key={item.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div>
                          <Link
                            href={`/scholarships/${sch?.id}`}
                            className="text-sm font-bold text-zinc-900 hover:text-violet-600 dark:text-zinc-100 dark:hover:text-violet-400"
                          >
                            {sch?.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {sch?.provider}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                              <IndianRupee className="h-3 w-3" />
                              ₹{sch?.awardAmount.toLocaleString("en-IN")}
                            </span>
                            {totalDocs > 0 && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-violet-700 dark:text-violet-400">
                                  {tickedDocs}/{totalDocs} Documents Ready
                                </span>
                              </>
                            )}
                          </div>
                          {item.notes && (
                            <p className="mt-1.5 rounded-lg bg-zinc-50 p-2 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              <strong>Notes:</strong> {item.notes}
                            </p>
                          )}
                        </div>

                        <Link
                          href={`/scholarships/${sch?.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3.5 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-600 hover:text-white dark:bg-violet-950/50 dark:text-violet-300 self-start sm:self-auto"
                        >
                          <span>Manage</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
