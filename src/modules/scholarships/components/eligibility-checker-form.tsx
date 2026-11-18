"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Calendar,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { EligibilityResult } from "../types";

export function EligibilityCheckerForm() {
  const t = useTranslations("scholarships.checker");
  const [community, setCommunity] = useState<"SC" | "ST">("SC");
  const [classLevel, setClassLevel] = useState("UG");
  const [course, setCourse] = useState("GENERAL");
  const [state, setState] = useState("Gujarat");
  const [annualIncome, setAnnualIncome] = useState<number>(200000);
  const [percentage, setPercentage] = useState<number>(65);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [eligibleCount, setEligibleCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/scholarships/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community,
          classLevel,
          course,
          state,
          annualIncome: Number(annualIncome),
          percentage: Number(percentage),
        }),
      });

      if (!res.ok) throw new Error("Evaluation request failed");
      const data = await res.json();
      setResults(data.results);
      setEligibleCount(data.eligibleCount);
    } catch (err) {
      console.error("Failed to check eligibility:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50/60 via-white to-purple-50/40 p-6 shadow-sm dark:border-violet-900/40 dark:from-violet-950/20 dark:via-zinc-900 dark:to-zinc-900 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Community Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("community")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCommunity("SC")}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                    community === "SC"
                      ? "border-violet-600 bg-violet-600 text-white shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  Scheduled Caste (SC)
                </button>
                <button
                  type="button"
                  onClick={() => setCommunity("ST")}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                    community === "ST"
                      ? "border-violet-600 bg-violet-600 text-white shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  Scheduled Tribe (ST)
                </button>
              </div>
            </div>

            {/* Current Education Class */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("classLevel")}
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="CLASS_9_10">Class 9 - 10 (Secondary)</option>
                <option value="CLASS_11_12">Class 11 - 12 (Higher Secondary)</option>
                <option value="DIPLOMA">Diploma / Polytechnic</option>
                <option value="UG">Undergraduate (UG / Bachelor)</option>
                <option value="PG">Postgraduate (PG / Master)</option>
                <option value="PHD">Ph.D. / M.Phil Research</option>
              </select>
            </div>

            {/* Degree / Course Stream */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("course")}
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="GENERAL">General Arts / Commerce / Science</option>
                <option value="STEM">Engineering / Computer Science / Tech</option>
                <option value="MEDICAL">Medical (MBBS / BDS / AYUSH / Nursing)</option>
                <option value="LAW">Law (LLB / LLM)</option>
              </select>
            </div>

            {/* State of Domicile */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("state")}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Gujarat">Gujarat Domicile</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("income")}
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Previous Exam Percentage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t("percentage")}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs text-zinc-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isLoading ? "Evaluating Schemes..." : t("checkButton")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
              {t("eligibleHeader", { count: eligibleCount })}
            </h3>
            <span className="text-xs text-zinc-500">
              Total {results.length} active schemes evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((res) => {
              return (
                <div
                  key={res.scholarshipId}
                  className={`rounded-2xl border p-5 shadow-xs transition ${
                    res.isEligible
                      ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 opacity-80"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {res.isEligible ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Eligible Match
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                            <XCircle className="h-3.5 w-3.5" />
                            Not Qualified
                          </span>
                        )}
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {res.category.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {res.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {res.provider}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-base font-black text-emerald-700 dark:text-emerald-400 flex items-center sm:justify-end">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span>{res.awardAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Closes: {new Date(res.deadline).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Reasons Breakdown */}
                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:grid-cols-2">
                    {/* Match Reasons */}
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        {t("matchReasons")}:
                      </span>
                      <ul className="mt-1 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {res.matchReasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 shrink-0">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mismatch Reasons (if any) */}
                    {res.mismatchReasons.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                          {t("mismatchReasons")}:
                        </span>
                        <ul className="mt-1 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                          {res.mismatchReasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-red-500 shrink-0">✕</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/scholarships/${res.scholarshipId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                    >
                      <span>{t("applyNow")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
