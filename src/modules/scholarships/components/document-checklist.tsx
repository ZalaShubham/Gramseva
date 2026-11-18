"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckSquare, Square, CheckCircle2, Lock, ShieldAlert } from "lucide-react";
import { CurrentUser } from "@/lib/auth";

interface DocumentChecklistProps {
  scholarshipId: string;
  documents: string[];
  initialChecklistState?: Record<string, boolean>;
  currentUser: CurrentUser | null;
}

export function DocumentChecklist({
  scholarshipId,
  documents,
  initialChecklistState = {},
  currentUser,
}: DocumentChecklistProps) {
  const t = useTranslations("scholarships.detail");
  const [ticks, setTicks] = useState<Record<string, boolean>>(initialChecklistState);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isLevel1 = currentUser && currentUser.level >= 1;

  const handleToggle = async (doc: string) => {
    if (!isLevel1) {
      setSaveMessage(t("loginPrompt"));
      return;
    }

    const updated = {
      ...ticks,
      [doc]: !ticks[doc],
    };
    setTicks(updated);

    try {
      setIsSaving(true);
      const res = await fetch("/api/scholarships/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId,
          status: "INTERESTED",
          checklistState: updated,
        }),
      });
      if (res.ok) {
        setSaveMessage("Checklist progress saved automatically");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (e) {
      console.error("Failed to save checklist ticks", e);
    } finally {
      setIsSaving(false);
    }
  };

  const tickedCount = documents.filter((d) => ticks[d]).length;
  const progressPercent = Math.round((tickedCount / (documents.length || 1)) * 100);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {t("checklistTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {t("checklistDesc")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {tickedCount} / {documents.length} Ready ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-emerald-600 transition-all duration-300 dark:bg-emerald-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-2.5">
        {documents.map((doc, idx) => {
          const isTicked = !!ticks[doc];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleToggle(doc)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                isTicked
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                  : "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {isTicked ? (
                <CheckSquare className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              ) : (
                <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
              )}
              <span className={`text-xs font-medium leading-relaxed ${isTicked ? "line-through opacity-85" : ""}`}>
                {doc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Auth / Feedback notice */}
      {saveMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {!isLevel1 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <span>{t("loginPrompt")}</span>
        </div>
      )}
    </div>
  );
}
