"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const languages = [
    { code: "gu", label: "ગુજરાતી", short: "GU" },
    { code: "hi", label: "हिन्दी", short: "HI" },
    { code: "en", label: "English", short: "EN" },
  ];

  return (
    <div className="relative inline-flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-medium shadow-xs dark:border-zinc-800 dark:bg-zinc-900 shrink-0">
      <div className="hidden sm:flex items-center gap-1 px-1.5 text-zinc-500 dark:text-zinc-400">
        <Globe className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-0.5">
        {languages.map((lang) => {
          const isActive = locale === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`rounded-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 transition min-h-[28px] sm:min-h-[32px] flex items-center justify-center font-semibold text-[11px] sm:text-xs ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs dark:bg-emerald-500"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
              title={lang.label}
              aria-label={`Switch to ${lang.label}`}
            >
              <span className="hidden sm:inline">{lang.label}</span>
              <span className="sm:hidden">{lang.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
