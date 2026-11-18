import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { listScholarships } from "@/modules/scholarships/scholarship-service";
import { ScholarshipSubnav } from "@/modules/scholarships/components/scholarship-subnav";
import { ScholarshipFilterBar } from "@/modules/scholarships/components/scholarship-filter-bar";
import { ScholarshipCard } from "@/modules/scholarships/components/scholarship-card";
import { GraduationCap, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

interface ScholarshipsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tab?: "active" | "ended";
    search?: string;
    category?: string;
    classLevel?: string;
    course?: string;
    state?: string;
    provider?: string;
    page?: string;
  }>;
}

export default async function ScholarshipsPage({
  params,
  searchParams,
}: ScholarshipsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "scholarships" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const currentUser = await getCurrentUser();
  const sp = await searchParams;

  const currentTab = sp.tab === "ended" ? "ended" : "active";
  const currentPage = sp.page ? parseInt(sp.page) : 1;

  const { items, total, totalPages } = await listScholarships({
    tab: currentTab,
    search: sp.search,
    category: sp.category,
    classLevel: sp.classLevel,
    course: sp.course,
    state: sp.state,
    provider: sp.provider,
    page: currentPage,
    limit: 9,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 mb-2">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Module 4 • Affirmative Education</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Sub Navigation */}
      <ScholarshipSubnav currentUser={currentUser} />

      {/* Filters & Tabs */}
      <div className="mb-8">
        <ScholarshipFilterBar
          currentTab={currentTab}
          currentFilters={{
            search: sp.search,
            category: sp.category,
            classLevel: sp.classLevel,
            course: sp.course,
            state: sp.state,
            provider: sp.provider,
          }}
        />
      </div>

      {/* Grid of Scholarship Cards */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {tCommon("emptyState")}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm">
            Try adjusting your category, education level, or search keyword filters.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <a
                key={pageNum}
                href={`?page=${pageNum}&tab=${currentTab}`}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? "bg-violet-600 text-white shadow-xs dark:bg-violet-500"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                }`}
              >
                {pageNum}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
