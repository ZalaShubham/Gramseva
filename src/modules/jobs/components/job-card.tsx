"use client";
import React from "react";
import { Link } from "@/i18n/routing";
import {
  Briefcase, MapPin, Calendar, IndianRupee, Users, ArrowRight,
  ShieldCheck, Clock, Building2, Wifi, Monitor, Globe
} from "lucide-react";
import { SeedJob } from "@/lib/seed-data";
import { JOB_TYPE_LABELS, WORKPLACE_LABELS, SECTOR_LABELS, CATEGORY_LABELS, QUOTA_LABELS } from "../types";

interface JobCardProps {
  job: SeedJob;
  isSaved?: boolean;
  onSave?: (jobId: string, saved: boolean) => void;
  isMatching?: boolean; // highlights qualification match
}

export function JobCard({ job, isSaved, onSave, isMatching }: JobCardProps) {
  const now = new Date();
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isExpired = deadline && deadline < now;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const sectorColor =
    job.sector === "GOVERNMENT"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
      : job.sector === "PSU"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";

  const formatSalary = (val?: number) =>
    val ? `₹${(val / 100000).toFixed(1)}L` : null;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
        isMatching
          ? "border-amber-300 bg-amber-50/60 dark:border-amber-700/60 dark:bg-amber-950/20"
          : "border-zinc-200 bg-white hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700/60"
      }`}
    >
      {isMatching && (
        <div className="absolute -top-2 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
          ⭐ Matches Your Qualification
        </div>
      )}

      <div>
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${sectorColor}`}>
              {SECTOR_LABELS[job.sector as keyof typeof SECTOR_LABELS] ?? job.sector}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {JOB_TYPE_LABELS[job.jobType as keyof typeof JOB_TYPE_LABELS] ?? job.jobType}
            </span>
            {job.isReservedForScSt && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                {job.targetCommunity ? `${job.targetCommunity} Reserved` : "SC/ST Reserved"}
              </span>
            )}
          </div>

          <div>
            {isExpired ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <Clock className="h-3 w-3" /> Expired
              </span>
            ) : daysLeft !== null && daysLeft <= 7 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse">
                <Clock className="h-3 w-3 text-red-600" /> {daysLeft}d left
              </span>
            ) : deadline ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-3 w-3" /> {deadline.toLocaleDateString("en-IN")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Title & Employer */}
        <div className="mt-3">
          <h3 className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-400 line-clamp-2">
            {job.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.employerName}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{job.city ? `${job.city}, ` : ""}{job.state}</span>
            <span className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {WORKPLACE_LABELS[job.workplaceType as keyof typeof WORKPLACE_LABELS] ?? job.workplaceType}
            </span>
          </p>
        </div>

        {/* Description */}
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {job.description}
        </p>

        {/* Pill tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Users className="h-3 w-3" /> {job.vacancies} vacanc{job.vacancies > 1 ? "ies" : "y"}
            </span>
          )}
          {job.qualification && job.qualification !== "ANY" && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {job.qualification.replace(/_/g, " ")}
            </span>
          )}
          {job.category && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {CATEGORY_LABELS[job.category] ?? job.category}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Salary</span>
          <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
            {job.minSalary || job.maxSalary ? (
              <>
                <IndianRupee className="h-3 w-3" />
                {formatSalary(job.minSalary)}
                {job.maxSalary ? ` – ${formatSalary(job.maxSalary)}` : ""}
              </>
            ) : (
              <span className="text-xs font-normal text-zinc-500">Not specified</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave(job.id, !isSaved)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs transition ${
                isSaved
                  ? "border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
              title={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? "🔖" : "🏷️"}
            </button>
          )}
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-600"
          >
            <span>View & Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}