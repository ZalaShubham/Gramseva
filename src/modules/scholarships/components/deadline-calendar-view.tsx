"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  Building2,
  IndianRupee,
  ArrowRight,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { SeedScholarship } from "@/lib/seed-data";
import { CurrentUser } from "@/lib/auth";

interface DeadlineCalendarViewProps {
  scholarships: SeedScholarship[];
  currentUser: CurrentUser | null;
}

export function DeadlineCalendarView({
  scholarships,
  currentUser,
}: DeadlineCalendarViewProps) {
  const t = useTranslations("scholarships.calendar");
  const [isTriggering, setIsTriggering] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const isLevel1 = currentUser && currentUser.level >= 1;

  // Filter to only future active scholarships and sort by earliest deadline
  const now = new Date();
  const sorted = scholarships
    .filter((s) => new Date(s.deadline) >= now && s.status !== "CLOSED")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const handleTriggerAlerts = async () => {
    if (!isLevel1) {
      setAlertFeedback("Level 1 phone verification is required to trigger deadline reminders.");
      return;
    }

    try {
      setIsTriggering(true);
      const res = await fetch("/api/scholarships/alerts", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAlertFeedback(t("alertsTriggered", { count: data.generatedCount }));
        setTimeout(() => setAlertFeedback(null), 5000);
      } else {
        setAlertFeedback(data.error || "Failed to trigger alerts");
      }
    } catch (e: any) {
      setAlertFeedback(e.message || "Failed to trigger alerts");
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            Automatic Deadline Notifications
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Reminders are scheduled at 7 days, 3 days, and 1 day before closing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl border border-zinc-200 p-0.5 text-xs font-semibold dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "list"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Timeline List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "calendar"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Month Grouped
            </button>
          </div>

          {/* Trigger Alert Button */}
          <button
            type="button"
            onClick={handleTriggerAlerts}
            disabled={isTriggering}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>{isTriggering ? "Checking..." : t("triggerAlerts")}</span>
          </button>
        </div>
      </div>

      {alertFeedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-violet-50 p-3 text-xs font-semibold text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
          <CheckCircle className="h-4 w-4 text-violet-600" />
          <span>{alertFeedback}</span>
        </div>
      )}

      {/* TIMELINE LIST VIEW */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {sorted.map((item) => {
            const deadlineDate = new Date(item.deadline);
            const diffTime = deadlineDate.getTime() - now.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let alertBadge = null;
            if (daysLeft <= 1) {
              alertBadge = (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  1-Day Final Notice
                </span>
              );
            } else if (daysLeft <= 3) {
              alertBadge = (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Clock className="h-3 w-3 text-amber-600" />
                  3-Day Reminder
                </span>
              );
            } else if (daysLeft <= 7) {
              alertBadge = (
                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-[10px] font-bold text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300">
                  <Clock className="h-3 w-3 text-yellow-600" />
                  7-Day Reminder
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs transition hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
                    <span className="text-[10px] uppercase font-mono">
                      {deadlineDate.toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="text-base leading-none">
                      {deadlineDate.getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h4>
                      {alertBadge}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {item.provider}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <IndianRupee className="h-3.5 w-3.5" />
                        ₹{item.awardAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {daysLeft} days remaining
                  </span>
                  <Link
                    href={`/scholarships/${item.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-600 hover:text-white dark:bg-violet-950/50 dark:text-violet-300"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MONTH GROUPED VIEW */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {["Nov 2026", "Dec 2026"].map((monthStr) => {
            const monthSchemes = sorted.filter((s) => {
              const d = new Date(s.deadline);
              const m = d.toLocaleString("en-US", { month: "short", year: "numeric" });
              return m === monthStr;
            });

            return (
              <div
                key={monthStr}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <h4 className="text-sm font-black uppercase tracking-wider text-violet-700 dark:text-violet-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {monthStr} Deadlines
                  </h4>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
                    {monthSchemes.length} Closing
                  </span>
                </div>

                <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {monthSchemes.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div className="pr-2">
                        <Link
                          href={`/scholarships/${s.id}`}
                          className="text-xs font-bold text-zinc-900 hover:text-violet-600 dark:text-zinc-100 dark:hover:text-violet-400 line-clamp-1"
                        >
                          {s.title}
                        </Link>
                        <span className="text-[11px] text-zinc-500">
                          Due: {new Date(s.deadline).toLocaleDateString("en-IN")} • ₹{s.awardAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Link
                        href={`/scholarships/${s.id}`}
                        className="text-xs font-bold text-violet-600 hover:underline shrink-0"
                      >
                        Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
