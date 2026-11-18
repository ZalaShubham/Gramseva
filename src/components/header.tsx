"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Landmark,
  Heart,
  Briefcase,
  GraduationCap,
  Users,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { DevLoginSwitcher } from "./dev-login-switcher";
import { CurrentUser } from "@/lib/auth";

interface HeaderProps {
  currentUser: CurrentUser | null;
  isDev: boolean;
}

export function Header({ currentUser, isDev }: HeaderProps) {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: tNav("home") },
    { href: "/politicians", label: tNav("politicians"), icon: Landmark },
    { href: "/matrimony", label: tNav("matrimony"), icon: Heart, levelRequired: 2 },
    { href: "/jobs", label: tNav("jobs"), icon: Briefcase },
    { href: "/scholarships", label: tNav("scholarships"), icon: GraduationCap },
    { href: "/network", label: tNav("network"), icon: Users, levelRequired: 2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2.5 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Block - Single Line, Tagline Hidden on Small Screens */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight text-zinc-950 transition hover:opacity-90 dark:text-white whitespace-nowrap"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                {tCommon("appName")}
              </span>
              <span className="hidden xl:inline-block text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                • {tCommon("tagline")}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isRestricted = link.levelRequired && (!currentUser || currentUser.level < link.levelRequired);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2.5 lg:px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-zinc-100 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.icon && <link.icon className="h-3.5 w-3.5 opacity-70" />}
                  <span>{link.label}</span>
                  {isRestricted && (
                    <span
                      title={tCommon("verifiedMembersOnly")}
                      aria-label={tCommon("verifiedMembersOnly")}
                      className="inline-flex items-center text-amber-600 dark:text-amber-400"
                    >
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Dev login, Language, Theme, Mobile Toggle */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dev Switcher */}
          {isDev && <DevLoginSwitcher currentUser={currentUser} />}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden dark:border-zinc-800 dark:text-zinc-300 shrink-0"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isRestricted = link.levelRequired && (!currentUser || currentUser.level < link.levelRequired);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </span>
                  {isRestricted && (
                    <span
                      title={tCommon("verifiedMembersOnly")}
                      className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-300"
                    >
                      <Lock className="h-3 w-3" />
                      <span>{tCommon("verifiedMembersOnly")}</span>
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/health"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {tNav("health")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
