"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserCheck, ShieldAlert, ChevronDown, Check } from "lucide-react";
import { SEED_TEST_USERS, SeedUser } from "@/lib/seed-data";
import { CurrentUser } from "@/lib/auth";

interface DevLoginSwitcherProps {
  currentUser: CurrentUser | null;
}

export function DevLoginSwitcher({ currentUser }: DevLoginSwitcherProps) {
  const router = useRouter();
  const tDevLogin = useTranslations("devLogin");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelectUser = async (user: SeedUser | null) => {
    try {
      await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user ? user.id : null }),
      });
      setIsOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error("Failed to switch dev user:", e);
    }
  };

  return (
    <div className="relative inline-block text-left text-xs font-medium shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-amber-300 bg-amber-50 px-2 sm:px-3 py-1.5 sm:py-2 text-amber-900 shadow-xs transition hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200"
        title={tDevLogin("title")}
        aria-label={tDevLogin("title")}
      >
        <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="hidden md:inline font-semibold">{tCommon("devLoginLabel")}</span>
        <span className="hidden sm:inline font-bold text-amber-950 dark:text-amber-100 max-w-[180px] truncate">
          {currentUser ? `${currentUser.name} (L${currentUser.level})` : tDevLogin("guestVisitorNoLogin")}
        </span>
        <span className="sm:hidden font-bold text-amber-950 dark:text-amber-100">
          {currentUser ? `L${currentUser.level}` : "L0"}
        </span>
        <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70 shrink-0" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-72 sm:w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10"
          role="menu"
        >
          <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-xs">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              {tDevLogin("tempSwitcher")}
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {tDevLogin("cookieNotice")}
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {/* Level 0 option */}
            <button
              onClick={() => handleSelectUser(null)}
              className={`flex w-full items-start justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                !currentUser
                  ? "bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {tDevLogin("guestVisitorNoLogin")}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {tDevLogin("publicBrowsingOnly")}
                </div>
              </div>
              {!currentUser && <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
            </button>

            {/* Seeded users */}
            {SEED_TEST_USERS.map((user) => {
              const isSelected = currentUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`flex w-full items-start justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                    isSelected
                      ? "bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="pr-2">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                      <span>{user.name}</span>
                      <span className="rounded bg-zinc-200 px-1 py-0.2 text-[10px] font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                        L{user.level}
                      </span>
                      <span className="rounded bg-amber-100 px-1 py-0.2 text-[10px] font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {user.role}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                      {user.titleBadge}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {user.community ? `${user.community} (${user.subCaste ?? ""}) • ` : ""}
                      {user.district}, {user.state}
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-100 pt-1.5 text-center dark:border-zinc-800">
            <span className="text-[10px] text-zinc-400">
              {tDevLogin("devOnly")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
