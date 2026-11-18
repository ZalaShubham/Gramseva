"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  GraduationCap,
  Sparkles,
  Calendar,
  BookmarkCheck,
  ShieldAlert,
} from "lucide-react";
import { CurrentUser } from "@/lib/auth";

interface ScholarshipSubnavProps {
  currentUser: CurrentUser | null;
}

export function ScholarshipSubnav({ currentUser }: ScholarshipSubnavProps) {
  const t = useTranslations("scholarships.nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/scholarships", label: t("browse"), icon: GraduationCap },
    { href: "/scholarships/eligibility", label: t("checker"), icon: Sparkles },
    { href: "/scholarships/calendar", label: t("calendar"), icon: Calendar },
    {
      href: "/scholarships/tracker",
      label: t("tracker"),
      icon: BookmarkCheck,
      levelRequired: 1,
    },
    ...(currentUser?.role === "ADMIN"
      ? [{ href: "/admin/scholarships", label: t("admin"), icon: ShieldAlert }]
      : []),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        const isGated = item.levelRequired && (!currentUser || currentUser.level < item.levelRequired);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-violet-600 text-white shadow-xs dark:bg-violet-500"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
            {isGated && (
              <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-mono font-bold text-amber-800 dark:text-amber-200">
                L1
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
