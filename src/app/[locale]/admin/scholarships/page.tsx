import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireRole } from "@/lib/auth";
import { listScholarships } from "@/modules/scholarships/scholarship-service";
import { ScholarshipSubnav } from "@/modules/scholarships/components/scholarship-subnav";
import { AdminScholarshipTable } from "@/modules/scholarships/components/admin-scholarship-table";
import { ShieldCheck } from "lucide-react";

import { Link } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface AdminScholarshipsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminScholarshipsPage({ params }: AdminScholarshipsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "scholarships.admin" });

  let adminUser;
  try {
    adminUser = await requireRole("ADMIN");
  } catch {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ScholarshipSubnav currentUser={null} />
        <div className="rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-3" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Admin Access Required
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            You must be logged in as an Administrator (e.g. Test Admin user) to manage official scholarship schemes.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/auth/dev-login"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
            >
              Switch to Admin Dev Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { items } = await listScholarships({
    tab: "active",
    limit: 100,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ScholarshipSubnav currentUser={adminUser} />

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Role: ADMIN • Governance Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <AdminScholarshipTable initialScholarships={items} />
    </div>
  );
}
