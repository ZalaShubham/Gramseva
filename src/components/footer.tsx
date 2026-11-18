import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Shield, Phone, Sparkles, Scale, HeartHandshake } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 pb-20 md:pb-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                {t("appName")}
              </span>
            </div>
            <p className="mt-2.5 max-w-md text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("tagline")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Phone className="h-3.5 w-3.5" />
              <span>{t("footerHelpline")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              {t("communitySafeguards")}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/health"
                  className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 flex items-center gap-1.5"
                >
                  <Shield className="h-3 w-3" />
                  {t("systemHealthUptime")}
                </Link>
              </li>
              <li>
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 cursor-not-allowed">
                  <Scale className="h-3 w-3" />
                  {t("footerLegal")}
                </span>
              </li>
            </ul>
          </div>

          {/* Legal and Privacy */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              {t("governancePolicies")}
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>{t("footerPrivacy")}</li>
              <li>{t("footerTerms")}</li>
              <li className="flex items-center gap-1.5 text-zinc-500">
                <HeartHandshake className="h-3 w-3" />
                {t("communityVouching")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
