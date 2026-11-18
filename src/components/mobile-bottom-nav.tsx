"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home, Landmark, Briefcase, GraduationCap, Heart, Lock } from "lucide-react";
import { CurrentUser } from "@/lib/auth";

interface MobileBottomNavProps {
  currentUser: CurrentUser | null;
}

export function MobileBottomNav({ currentUser }: MobileBottomNavProps) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const items = [
    { href: "/", label: tNav("home"), icon: Home },
    { href: "/politicians", label: tNav("politicians"), icon: Landmark },
    { href: "/jobs", label: tNav("jobs"), icon: Briefcase },
    { href: "/scholarships", label: tNav("scholarships"), icon: GraduationCap },
    { href: "/matrimony", label: tNav("matrimony"), icon: Heart, levelRequired: 2 },
  ];

  return (
    <nav
      aria-label={tNav("home")}
      className="fixed bottom-0 left-0 right-0 z-40 block border-t border-zinc-200 bg-white/95 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/95 shadow-lg"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const isRestricted = item.levelRequired && (!currentUser || currentUser.level < item.levelRequired);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-center transition ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {isRestricted && (
                  <span
                    title={tCommon("verifiedMembersOnly")}
                    aria-label={tCommon("verifiedMembersOnly")}
                    className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-white"
                  >
                    <Lock className="h-2 w-2" />
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
