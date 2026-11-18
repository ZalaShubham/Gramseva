import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { listJobs, getMyResumes } from "@/modules/jobs/job-service";
import { JobFilterBar } from "@/modules/jobs/components/job-filter-bar";
import { JobCard } from "@/modules/jobs/components/job-card";
import { JobSubnav } from "@/modules/jobs/components/job-subnav";
import { Briefcase, Inbox, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";

import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

interface JobsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tab?: string;
    search?: string;
    sector?: string;
    jobType?: string;
    qualification?: string;
    quota?: string;
    state?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function JobsPage({ params, searchParams }: JobsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const currentUser = await getCurrentUser();
  const currentPage = sp.page ? parseInt(sp.page) : 1;
  const currentTab = (sp.tab || "all") as "all" | "government" | "private" | "reserved";

  // Load user qualification for smart sorting
  let userQualification: string | null = null;
  if (currentUser) {
    const resumes = await getMyResumes(currentUser.id);
    const defaultResume = resumes.find((r) => r.isDefault) ?? resumes[0];
    userQualification = defaultResume?.qualification ?? null;
  }

  const { items, total, totalPages } = await listJobs(
    {
      tab: currentTab,
      search: sp.search,
      sector: sp.sector as any,
      jobType: sp.jobType as any,
      qualification: sp.qualification,
      quota: sp.quota as any,
      state: sp.state,
      category: sp.category,
      page: currentPage,
      limit: 9,
    },
    userQualification
  );

  const tabs = [
    { key: "all", label: "All Jobs" },
    { key: "government", label: "Government" },
    { key: "private", label: "Private / PSU" },
    { key: "reserved", label: "SC/ST Reserved" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Module 2 • Jobs & Careers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
          SC/ST Jobs & Affirmative Careers
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Government reserved posts, PSU backlog vacancies, and corporate affirmative hiring — all verified with official source links.
          {userQualification && (
            <span className="ml-1 text-amber-700 dark:text-amber-400 font-semibold">
              ⭐ Jobs matching your qualification ({userQualification.replace(/_/g, " ")}) appear first.
            </span>
          )}
        </p>
      </div>

      {/* Subnav */}
      <JobSubnav currentUser={currentUser} />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50/70 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/40">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={`?tab=${tab.key}`}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition ${
              currentTab === tab.key
                ? "bg-blue-600 text-white shadow-xs"
                : "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            {tab.key === "reserved" && <ShieldCheck className="h-3.5 w-3.5" />}
            {tab.label}
          </a>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-8">
        <JobFilterBar
          currentTab={currentTab}
          currentFilters={{
            search: sp.search,
            sector: sp.sector,
            jobType: sp.jobType,
            qualification: sp.qualification,
            quota: sp.quota,
            state: sp.state,
            category: sp.category,
          }}
        />
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{total} job{total !== 1 ? "s" : ""} found</span>
        {sp.search && (
          <span className="text-xs text-zinc-500">for &quot;{sp.search}&quot;</span>
        )}
      </div>

      {/* Job Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isMatching={!!(userQualification && job.qualification === userQualification)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <Inbox className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No jobs found matching your filters</h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm">
            Try adjusting your filters, search terms, or browse a different tab.
          </p>
          <Link href="/jobs" className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
            Reset & Browse All
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === currentPage;
            const searchStr = new URLSearchParams({ ...(sp as Record<string, string>), page: String(pageNum) }).toString();
            return (
              <Link
                key={pageNum}
                href={`/jobs?${searchStr}`}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}