import React from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth";
import {
  getScholarshipById,
  getUserScholarshipTracks,
} from "@/modules/scholarships/scholarship-service";
import { ScholarshipSubnav } from "@/modules/scholarships/components/scholarship-subnav";
import { DocumentChecklist } from "@/modules/scholarships/components/document-checklist";
import { ApplicationTrackerWidget } from "@/modules/scholarships/components/application-tracker-widget";
import {
  Building2,
  Calendar,
  IndianRupee,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { TrackStatus } from "@/modules/scholarships/types";

export const dynamic = "force-dynamic";

interface ScholarshipDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ScholarshipDetailPage({
  params,
}: ScholarshipDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "scholarships" });
  const currentUser = await getCurrentUser();

  const scholarship = await getScholarshipById(id);
  if (!scholarship) {
    notFound();
  }

  // Retrieve user's existing track if logged in
  let existingTrack: any = null;
  if (currentUser) {
    const tracks = await getUserScholarshipTracks(currentUser.id);
    existingTrack = tracks.find((t) => t.scholarshipId === id);
  }

  const deadlineDate = new Date(scholarship.deadline);
  const now = new Date();
  const isPast = deadlineDate < now || scholarship.status === "CLOSED";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link & Subnav */}
      <div className="mb-4">
        <Link
          href="/scholarships"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Scholarships List</span>
        </Link>
        <ScholarshipSubnav currentUser={currentUser} />
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-zinc-100 pb-6 dark:border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
                {scholarship.category.replace("_", " ")}
              </span>
              <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {scholarship.classLevel || "All Levels"}
              </span>
              {scholarship.community && (
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {scholarship.community} Reserved
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
              {scholarship.title}
            </h1>

            <p className="mt-1.5 flex items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              <Building2 className="h-4 w-4 shrink-0" />
              <span>{scholarship.provider}</span>
            </p>
          </div>

          {/* Award Amount & Deadline Box */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-left sm:text-right dark:border-zinc-800 dark:bg-zinc-950/60 sm:min-w-[200px]">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              {t("card.amount")}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center sm:justify-end">
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{scholarship.awardAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-2 text-xs text-zinc-500 flex items-center sm:justify-end gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Closes: {deadlineDate.toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Links & Source Verification Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Official Portal Button */}
            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-700 dark:bg-violet-500"
            >
              <span>{t("detail.officialPortal")}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* Source Reference Link */}
            <a
              href={scholarship.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span>{t("detail.sourceLink")}</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {t("detail.lastUpdated")}: {new Date(scholarship.lastVerifiedAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Details, Steps, Rejections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Criteria */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              {t("detail.eligibility")}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 mb-4">
              {scholarship.eligibilityCriteria}
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              {scholarship.maxFamilyIncome && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Income Limit</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    &lt; ₹{scholarship.maxFamilyIncome.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
              {scholarship.minPercentage && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Min Percentage</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {scholarship.minPercentage}% Benchmark
                  </p>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Applicable Region</span>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {scholarship.isNational ? "All India (National)" : scholarship.state || "State"}
                </p>
              </div>
            </div>
          </div>

          {/* How to Apply (Step-by-Step) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-violet-600" />
              {t("detail.howToApply")}
            </h3>
            <ol className="space-y-2.5">
              {scholarship.howToApplySteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-800 text-[10px] dark:bg-violet-950 dark:text-violet-300">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Interactive Document Checklist */}
          <DocumentChecklist
            scholarshipId={scholarship.id}
            documents={scholarship.documentsRequired}
            initialChecklistState={existingTrack?.checklistState || {}}
            currentUser={currentUser}
          />

          {/* Common Rejection Reasons Section */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              {t("detail.rejectionsTitle")}
            </h3>
            <ul className="space-y-2 text-xs text-amber-950/80 dark:text-amber-200/80">
              {scholarship.commonRejectionReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Application Tracker Widget */}
        <div className="space-y-6">
          <ApplicationTrackerWidget
            scholarshipId={scholarship.id}
            initialStatus={(existingTrack?.status as TrackStatus) || "INTERESTED"}
            initialNotes={existingTrack?.notes || ""}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
