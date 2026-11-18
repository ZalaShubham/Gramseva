"use client";
import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Briefcase, Bookmark, Activity, FileText, Building2, BookOpen, ShieldCheck } from "lucide-react";
import { CurrentUser } from "@/lib/auth";

interface JobSubnavProps {
  currentUser: CurrentUser | null;
}

export function JobSubnav({ currentUser }: JobSubnavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/jobs", label: "Browse Jobs", icon: Briefcase, minLevel: 0 },
    { href: "/jobs/exam", label: "Exam Help", icon: BookOpen, minLevel: 0 },
    { href: "/jobs/saved", label: "Saved Jobs & Alerts", icon: Bookmark, minLevel: 1 },
    { href: "/jobs/tracker", label: "Application Tracker", icon: Activity, minLevel: 2 },
    { href: "/jobs/resume", label: "Resume Builder", icon: FileText, minLevel: 1 },
    { href: "/jobs/employer", label: "Employer Panel", icon: Building2, minRole: "EMPLOYER" },
  ];

  const userLevel = currentUser?.level ?? 0;
  const userRole = currentUser?.role ?? "USER";

  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50/70 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/40" aria-label="Jobs module navigation">
      {navItems.map((item) => {
        const isLocked = (item.minLevel !== undefined && userLevel < item.minLevel) ||
          (item.minRole && userRole !== item.minRole && userRole !== "ADMIN");

        const isActive = pathname === item.href || (item.href !== "/jobs" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-blue-600 text-white shadow-xs"
                : isLocked
                ? "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                : "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
            {isLocked && (
              <span className="text-[10px]">🔒</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}