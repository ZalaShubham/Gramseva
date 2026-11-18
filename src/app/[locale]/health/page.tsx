import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import {
  Activity,
  CheckCircle,
  Database,
  Globe,
  Server,
  Clock,
  UserCheck,
} from "lucide-react";

interface HealthPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HealthPage({ params }: HealthPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "health" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const currentUser = await getCurrentUser();
  const timestamp = new Date().toISOString();
  const uptime = `${Math.floor(process.uptime())}s`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Overall Status */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              {t("status")}
            </span>
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 text-xl font-black text-emerald-700 dark:text-emerald-400">
            {t("operational")}
          </div>
          <div className="mt-1 text-[11px] text-emerald-800/80 dark:text-emerald-400/80">
            {t("allOperational")}
          </div>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("database")}
            </span>
            <Database className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-3 text-xl font-black text-zinc-900 dark:text-zinc-100">
            PostgreSQL / Prisma
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {t("dbDesc")}
          </div>
        </div>

        {/* Environment */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("environment")}
            </span>
            <Server className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-3 text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase">
            {process.env.NODE_ENV || "development"}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {t("appRouter")}
          </div>
        </div>

        {/* i18n Locales */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("i18nConfig")}
            </span>
            <Globe className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-3 text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              gu
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              hi
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              en
            </span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {t("i18nDesc")}
          </div>
        </div>

        {/* Auth / Dev Session */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("authSession")}
            </span>
            <UserCheck className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {currentUser ? currentUser.name : tCommon("guestVisitor")}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {tCommon("role")}: {currentUser ? currentUser.role : tCommon("visitorRole")} • {tCommon("accessLevel")}: L{currentUser ? currentUser.level : 0}
          </div>
        </div>

        {/* Uptime & Time */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("uptime")}
            </span>
            <Clock className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-3 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
            {uptime}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono truncate">
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
