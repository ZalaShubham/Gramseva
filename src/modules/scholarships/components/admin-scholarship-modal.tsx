"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ShieldAlert,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Globe,
  Calendar,
  Save,
} from "lucide-react";
import { SeedScholarship } from "@/lib/seed-data";
import { SCHOLARSHIP_CATEGORIES, CLASS_LEVELS, COURSES } from "../types";

interface AdminScholarshipModalProps {
  scholarshipToEdit?: SeedScholarship | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminScholarshipModal({
  scholarshipToEdit,
  isOpen,
  onClose,
  onSuccess,
}: AdminScholarshipModalProps) {
  const router = useRouter();
  const t = useTranslations("scholarships.admin");

  const [title, setTitle] = useState(scholarshipToEdit?.title || "");
  const [provider, setProvider] = useState(scholarshipToEdit?.provider || "");
  const [description, setDescription] = useState(scholarshipToEdit?.description || "");
  const [eligibilityCriteria, setEligibilityCriteria] = useState(
    scholarshipToEdit?.eligibilityCriteria || ""
  );
  const [category, setCategory] = useState(scholarshipToEdit?.category || "POST_MATRIC");
  const [course, setCourse] = useState(scholarshipToEdit?.course || "GENERAL");
  const [classLevel, setClassLevel] = useState(scholarshipToEdit?.classLevel || "UG");
  const [community, setCommunity] = useState<"SC" | "ST" | "">(
    scholarshipToEdit?.community || ""
  );
  const [awardAmount, setAwardAmount] = useState<number>(
    scholarshipToEdit?.awardAmount || 50000
  );
  const [deadline, setDeadline] = useState(
    scholarshipToEdit?.deadline ? scholarshipToEdit.deadline.slice(0, 10) : "2026-12-31"
  );
  const [applicationUrl, setApplicationUrl] = useState(
    scholarshipToEdit?.applicationUrl || "https://scholarships.gov.in"
  );
  const [sourceUrl, setSourceUrl] = useState(
    scholarshipToEdit?.sourceUrl || "https://socialjustice.gov.in/schemes"
  );
  const [stepsText, setStepsText] = useState(
    scholarshipToEdit?.howToApplySteps?.join("\n") ||
      "1. Register on portal with Aadhaar\n2. Upload documents\n3. Submit to institute"
  );
  const [docsText, setDocsText] = useState(
    scholarshipToEdit?.documentsRequired?.join("\n") ||
      "Caste Certificate\nIncome Certificate\nMarksheet\nBank Passbook"
  );
  const [rejectionsText, setRejectionsText] = useState(
    scholarshipToEdit?.commonRejectionReasons?.join("\n") ||
      "Income certificate expired\nBank not linked to Aadhaar DBT"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const payload = {
      title,
      provider,
      description,
      eligibilityCriteria,
      category,
      course,
      classLevel,
      community: community || null,
      awardAmount: Number(awardAmount),
      deadline: new Date(deadline).toISOString(),
      applicationUrl,
      sourceUrl,
      howToApplySteps: stepsText.split("\n").filter((s) => s.trim().length > 0),
      documentsRequired: docsText.split("\n").filter((d) => d.trim().length > 0),
      commonRejectionReasons: rejectionsText.split("\n").filter((r) => r.trim().length > 0),
      status: "OPEN",
    };

    try {
      const url = scholarshipToEdit
        ? `/api/admin/scholarships/${scholarshipToEdit.id}`
        : "/api/admin/scholarships";
      const method = scholarshipToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save scholarship");
      }

      onSuccess();
      onClose();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!scholarshipToEdit) return;
    if (!confirm(t("confirmArchive"))) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/scholarships/${scholarshipToEdit.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to archive scholarship");
      }
      onSuccess();
      onClose();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-violet-600" />
            {scholarshipToEdit ? t("edit") : t("createNew")}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {t("sourceUrlNote")}
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Scheme Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Provider Department
              </label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {SCHOLARSHIP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Course Stream
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {COURSES.map((cr) => (
                  <option key={cr} value={cr}>
                    {cr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Class Level
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {CLASS_LEVELS.map((cl) => (
                  <option key={cl} value={cl}>
                    {cl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Target Community
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="">Both SC & ST</option>
                <option value="SC">SC Only</option>
                <option value="ST">ST Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Award Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={awardAmount}
                onChange={(e) => setAwardAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Closing Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Mandatory Official Source URL
              </label>
              <input
                type="url"
                required
                placeholder="https://socialjustice.gov.in/schemes/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Official Application Portal URL
              </label>
              <input
                type="url"
                required
                placeholder="https://scholarships.gov.in"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Description & Benefits
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Eligibility Criteria Description
              </label>
              <textarea
                rows={2}
                required
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Required Documents Checklist (one per line)
              </label>
              <textarea
                rows={3}
                required
                value={docsText}
                onChange={(e) => setDocsText(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                How to Apply Steps (one per line)
              </label>
              <textarea
                rows={3}
                required
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Common Rejection Reasons (one per line)
              </label>
              <textarea
                rows={2}
                value={rejectionsText}
                onChange={(e) => setRejectionsText(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-800 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
            {scholarshipToEdit ? (
              <button
                type="button"
                onClick={handleArchive}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t("archive")}</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? "Saving..." : t("save")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
