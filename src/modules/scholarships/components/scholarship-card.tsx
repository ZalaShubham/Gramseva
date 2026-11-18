import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Calendar,
  IndianRupee,
  Building2,
  Globe,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { SeedScholarship } from "@/lib/seed-data";

interface ScholarshipCardProps {
  scholarship: SeedScholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const t = useTranslations("scholarships");
  const now = new Date();
  const deadlineDate = new Date(scholarship.deadline);
  const isPast = deadlineDate < now || scholarship.status === "CLOSED";

  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
        isPast
          ? "border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40 opacity-85"
          : "border-zinc-200 bg-white hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700/60"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
              {scholarship.category.replace("_", " ")}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {scholarship.classLevel || "All Levels"}
            </span>
            {scholarship.community && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {scholarship.community} Reserved
              </span>
            )}
          </div>

          <div>
            {isPast ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                <Clock className="h-3 w-3" />
                {t("card.expired")}
              </span>
            ) : daysLeft <= 7 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse">
                <Clock className="h-3 w-3 text-red-600" />
                {t("card.daysRemaining", { count: daysLeft })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-3 w-3" />
                {deadlineDate.toLocaleDateString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Title & Provider */}
        <div className="mt-3">
          <h3 className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-400">
            {scholarship.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{scholarship.provider}</span>
          </p>
        </div>

        {/* Short Description */}
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {scholarship.description}
        </p>

        {/* Criteria Pill Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          {scholarship.maxFamilyIncome && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Income &lt; ₹{(scholarship.maxFamilyIncome / 100000).toFixed(1)}L
            </span>
          )}
          {scholarship.minPercentage && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Min {scholarship.minPercentage}% marks
            </span>
          )}
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {scholarship.isNational ? t("card.national") : scholarship.state || "State"}
          </span>
        </div>
      </div>

      {/* Footer: Amount & Action Link */}
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            {t("card.amount")}
          </span>
          <div className="text-base font-black text-emerald-700 dark:text-emerald-400 flex items-center">
            <IndianRupee className="h-3.5 w-3.5" />
            <span>{scholarship.awardAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <Link
          href={`/scholarships/${scholarship.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3.5 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-600 hover:text-white dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-600"
        >
          <span>{t("card.viewDetails")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
