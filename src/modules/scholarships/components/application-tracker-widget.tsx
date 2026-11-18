"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { BookmarkCheck, Save, CheckCircle, ShieldAlert, Lock } from "lucide-react";
import { CurrentUser } from "@/lib/auth";
import { TrackStatus } from "../types";

interface ApplicationTrackerWidgetProps {
  scholarshipId: string;
  initialStatus?: TrackStatus;
  initialNotes?: string;
  currentUser: CurrentUser | null;
}

export function ApplicationTrackerWidget({
  scholarshipId,
  initialStatus = "INTERESTED",
  initialNotes = "",
  currentUser,
}: ApplicationTrackerWidgetProps) {
  const t = useTranslations("scholarships");
  const [status, setStatus] = useState<TrackStatus>(initialStatus);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isLevel1 = currentUser && currentUser.level >= 1;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLevel1) {
      setStatusMsg({
        text: t("detail.loginPrompt"),
        type: "error",
      });
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/scholarships/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId,
          status,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update tracker");
      }

      setStatusMsg({ text: "Tracking status and notes saved successfully!", type: "success" });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions: { value: TrackStatus; label: string; badgeColor: string }[] = [
    { value: "INTERESTED", label: t("status.interested"), badgeColor: "bg-blue-100 text-blue-800" },
    { value: "APPLIED", label: t("status.applied"), badgeColor: "bg-amber-100 text-amber-800" },
    { value: "RECEIVED", label: t("status.received"), badgeColor: "bg-emerald-100 text-emerald-800" },
    { value: "REJECTED", label: t("status.rejected"), badgeColor: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <BookmarkCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {t("detail.trackStatusTitle")}
        </h3>
      </div>

      <form onSubmit={handleSave} className="mt-4 space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            {t("detail.statusLabel")}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statusOptions.map((opt) => {
              const isSelected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-900 shadow-xs dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-200"
                      : "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            {t("detail.notesLabel")}
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Application No: GUJ-SC-2026-9812, Node Desk verified on Oct 10th..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-400"
          />
        </div>

        {statusMsg && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          {!isLevel1 ? (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              {t("detail.level1Required")}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">Auto-saved securely to your profile</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : t("detail.saveNotes")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
