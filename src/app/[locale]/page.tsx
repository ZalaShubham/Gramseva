import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth";
import {
  Landmark,
  Heart,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Search,
  ChevronRight,
  Sparkles,
  Building2,
  MapPin,
  Lock,
} from "lucide-react";
import {
  SEED_POLITICIANS,
  SEED_JOBS,
  SEED_SCHOLARSHIPS,
} from "@/lib/seed-data";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tModules = await getTranslations({ locale, namespace: "modules" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const currentUser = await getCurrentUser();

  const userLevel = currentUser ? currentUser.level : 0;

  // Sample data from seed dataset for the public browsing showcase
  const previewPoliticians = SEED_POLITICIANS.slice(0, 3);
  const previewJobs = SEED_JOBS.slice(0, 3);
  const previewScholarships = SEED_SCHOLARSHIPS.slice(0, 3);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-zinc-50/50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 dark:border-zinc-800 dark:from-emerald-950/20 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{tCommon("appName")} • {tCommon("digitalPublicGood")}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-white">
            {tHome("heroTitle")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            {tHome("heroSubtitle")}
          </p>

          {/* Current Persona Status Banner */}
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold ${
                    userLevel === 2
                      ? "bg-emerald-600"
                      : userLevel === 1
                      ? "bg-blue-600"
                      : "bg-zinc-500"
                  }`}
                >
                  L{userLevel}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                    {currentUser ? currentUser.name : tCommon("guestVisitor")}
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {currentUser ? currentUser.role : tCommon("visitorRole")}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {userLevel === 0 && tCommon("level0")}
                    {userLevel === 1 && tCommon("level1")}
                    {userLevel === 2 && tCommon("level2")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {currentUser?.verifiedAt ? tCommon("verifiedBadge") : tCommon("activeSession")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CORE MODULE CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {tHome("modulesTitle")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {tHome("modulesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Politician Module */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Landmark className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {tCommon("level0Public")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {tModules("politician.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tModules("politician.desc")}
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <Link
                href="/politicians"
                className="flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <span>{tModules("politician.action")}</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 2. Matrimonial Module */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                  <Heart className="h-6 w-6" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                  <Lock className="h-3 w-3" />
                  {tCommon("level2Verified")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {tModules("matrimony.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tModules("matrimony.desc")}
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <Link
                href="/matrimony"
                className="flex items-center justify-between text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                <span>{tModules("matrimony.action")}</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 3. Jobs Module */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                  {tCommon("scStQuotas")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {tModules("jobs.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tModules("jobs.desc")}
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <Link
                href="/jobs"
                className="flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>{tModules("jobs.action")}</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 4. Scholarships Module */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                  {tCommon("directBenefits")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {tModules("scholarships.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tModules("scholarships.desc")}
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <Link
                href="/scholarships"
                className="flex items-center justify-between text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                <span>{tModules("scholarships.action")}</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC BROWSING SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Building2 className="h-3.5 w-3.5" />
                {tHome("publicTitle")}
              </div>
              <h2 className="mt-1 text-2xl font-black text-zinc-950 dark:text-zinc-50">
                {tCommon("openCommunityDatasets")}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {tHome("publicSubtitle")}
              </p>
            </div>

            {/* Public search bar */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={tCommon("search")}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-800 shadow-xs focus:border-emerald-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* PREVIEW GRIDS */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Politicians Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5 text-emerald-600" />
                  {tCommon("electedRepresentatives")}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {tCommon("totalCount", { count: 10 })}
                </span>
              </div>
              <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {previewPoliticians.map((pol) => (
                  <div key={pol.id} className="py-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {pol.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {pol.constituency} • {pol.party}
                        </div>
                      </div>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {tCommon("worksCount", { count: pol.worksCount })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                  {tCommon("affirmativeJobs")}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {tCommon("totalCount", { count: 20 })}
                </span>
              </div>
              <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {previewJobs.map((job) => (
                  <div key={job.id} className="py-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                          <span>{job.employerName}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-0.5" />
                            {job.city}
                          </span>
                        </div>
                      </div>
                      {job.isReservedForScSt && (
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                          {job.targetCommunity
                            ? tCommon("communityReserved", { community: job.targetCommunity })
                            : tCommon("scStQuota")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarships Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                  {tCommon("welfareScholarships")}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {tCommon("totalCount", { count: 20 })}
                </span>
              </div>
              <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {previewScholarships.map((sch) => (
                  <div key={sch.id} className="py-2.5">
                    <div className="flex items-start justify-between">
                      <div className="max-w-[190px]">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {sch.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          ₹{sch.awardAmount.toLocaleString("en-IN")} • {sch.community ?? tCommon("scAndSt")}
                        </div>
                      </div>
                      <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                        {sch.isNational ? tCommon("national") : sch.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
