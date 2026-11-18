import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth";
import { getJob } from "@/modules/jobs/job-service";
import {
  MapPin, IndianRupee, Users, ExternalLink,
  ShieldCheck, Clock, Building2, CheckCircle, BookOpen, FileText,
  ClipboardList, ArrowLeft, Globe, Link2
} from "lucide-react";
import { SECTOR_LABELS, JOB_TYPE_LABELS, WORKPLACE_LABELS, CATEGORY_LABELS, QUALIFICATION_LABELS, QUOTA_LABELS } from "@/modules/jobs/types";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const job = await getJob(id);
  if (!job) notFound();

  const currentUser = await getCurrentUser();
  const now = new Date();
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isExpired = deadline && deadline < now;
  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const formatSalary = (v?: number) => v ? `₹${(v / 100000).toFixed(1)}L` : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/jobs" className="inline-flex items-center gap-1 hover:text-blue-600">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
        </Link>
        <span>•</span>
        <span className="truncate">{job.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                    job.sector === "GOVERNMENT" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : job.sector === "PSU" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}>
                    {SECTOR_LABELS[job.sector as keyof typeof SECTOR_LABELS] ?? job.sector}
                  </span>
                  {job.isReservedForScSt && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      {job.targetCommunity ? `${job.targetCommunity} Reserved` : "SC/ST Reserved"}
                    </span>
                  )}
                  {isExpired && (
                    <span className="rounded-lg bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-800 dark:bg-red-950/60 dark:text-red-300">
                      Expired
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{job.title}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  <Building2 className="h-4 w-4 shrink-0" />
                  {job.employerName}
                </p>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Location</p>
                <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {job.city ? `${job.city}, ` : ""}{job.state}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Vacancies</p>
                <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-zinc-400" />
                  {job.vacancies}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Salary</p>
                <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                  {formatSalary(job.minSalary) && (
                    <>
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatSalary(job.minSalary)}{job.maxSalary ? ` – ${formatSalary(job.maxSalary)}` : ""}
                    </>
                  ) || <span className="text-zinc-400 font-normal">Not specified</span>}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Last Date</p>
                <div className="mt-1">
                  {isExpired ? (
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">Expired</span>
                  ) : daysLeft !== null && daysLeft <= 7 ? (
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1 animate-pulse">
                      <Clock className="h-3.5 w-3.5" /> {daysLeft}d left
                    </span>
                  ) : deadline ? (
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  ) : (
                    <span className="text-sm text-zinc-400">Not set</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4">About This Role</h2>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Eligibility */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4">Eligibility & Requirements</h2>

            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              {job.qualification && (
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Qualification</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {QUALIFICATION_LABELS[job.qualification] ?? job.qualification}
                  </p>
                </div>
              )}
              {(job.minAge || job.maxAge) && (
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Age Limit</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {job.minAge && job.maxAge ? `${job.minAge} – ${job.maxAge} years`
                      : job.maxAge ? `Up to ${job.maxAge} years`
                      : `Min ${job.minAge} years`}
                  </p>
                </div>
              )}
              {job.quota && (
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Quota</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {QUOTA_LABELS[job.quota as keyof typeof QUOTA_LABELS] ?? job.quota}
                  </p>
                </div>
              )}
              {job.ageRelaxation && (
                <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/20 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Age Relaxation (SC/ST)</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-800 dark:text-emerald-300">{job.ageRelaxation}</p>
                </div>
              )}
            </div>

            {job.requirements && (
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{job.requirements}</p>
            )}
          </div>

          {/* How to Apply */}
          {job.howToApplySteps && job.howToApplySteps.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" /> How to Apply
              </h2>
              <ol className="space-y-3">
                {job.howToApplySteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Exam Help Links */}
          {(job.syllabusUrl || job.admitCardUrl || job.resultUrl) && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6 dark:border-violet-900/60 dark:bg-violet-950/20">
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-600" /> Exam Resources
              </h2>
              <div className="grid gap-2 sm:grid-cols-3">
                {job.syllabusUrl && (
                  <a href={job.syllabusUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-300">
                    <FileText className="h-4 w-4" /> Syllabus PDF
                  </a>
                )}
                {job.admitCardUrl && (
                  <a href={job.admitCardUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-300">
                    <FileText className="h-4 w-4" /> Admit Card
                  </a>
                )}
                {job.resultUrl && (
                  <a href={job.resultUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-300">
                    <CheckCircle className="h-4 w-4" /> Results
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Apply / Track CTA */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Apply for This Job</h3>

            {isExpired ? (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:border-red-900/60 dark:text-red-400">
                Application window has closed.
              </div>
            ) : !currentUser ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Sign in to save or track this job.</p>
                <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                  🔒 Level 1 required to save
                </Link>
              </div>
            ) : currentUser.level < 2 ? (
              <div className="space-y-2">
                {job.officialUrl ? (
                  <a href={job.officialUrl} target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4" /> Apply on Official Portal
                  </a>
                ) : (
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4" /> View Official Listing
                  </a>
                )}
                <Link href="/jobs/tracker"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  Track Manually (External)
                </Link>
                <p className="text-[11px] text-zinc-400 text-center">Level 2 verification required to apply inside platform</p>
              </div>
            ) : (
              <div className="space-y-2">
                {!job.isExternal && (
                  <a href={`/api/jobs/apply`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                    <CheckCircle className="h-4 w-4" /> Apply Inside Platform
                  </a>
                )}
                {job.officialUrl && (
                  <a href={job.officialUrl} target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                    <ExternalLink className="h-3.5 w-3.5" /> Apply on Official Portal
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Job Meta */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Job Details</h3>
            <div className="space-y-2">
              {[
                { label: "Category", value: CATEGORY_LABELS[job.category] ?? job.category },
                { label: "Job Type", value: JOB_TYPE_LABELS[job.jobType as keyof typeof JOB_TYPE_LABELS] ?? job.jobType },
                { label: "Workplace", value: WORKPLACE_LABELS[job.workplaceType as keyof typeof WORKPLACE_LABELS] ?? job.workplaceType },
                { label: "Employer", value: job.employerName },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Links */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Official Sources</h3>
            {job.sourceUrl && (
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 truncate">
                <Link2 className="h-3.5 w-3.5 shrink-0" /> Official Source Reference
              </a>
            )}
            {job.officialUrl && (
              <a href={job.officialUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 truncate">
                <Globe className="h-3.5 w-3.5 shrink-0" /> Official Application Portal
              </a>
            )}
            <p className="text-[10px] text-zinc-400">
              All listings verified with official government portal or employer source URLs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}