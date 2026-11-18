"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { SeedScholarship } from "@/lib/seed-data";
import { AdminScholarshipModal } from "./admin-scholarship-modal";

interface AdminScholarshipTableProps {
  initialScholarships: SeedScholarship[];
}

export function AdminScholarshipTable({
  initialScholarships,
}: AdminScholarshipTableProps) {
  const t = useTranslations("scholarships.admin");
  const [scholarships, setScholarships] = useState<SeedScholarship[]>(initialScholarships);
  const [selectedScheme, setSelectedScheme] = useState<SeedScholarship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNew = () => {
    setSelectedScheme(null);
    setIsModalOpen(true);
  };

  const handleEdit = (scheme: SeedScholarship) => {
    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500">
          Total {scholarships.length} schemes managed
        </span>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-violet-700 dark:bg-violet-500"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("createNew")}</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Scheme & Category</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Official Source URL</th>
              <th className="px-4 py-3">Last Verified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {scholarships.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[220px]">
                  <div className="truncate">{s.title}</div>
                  <span className="text-[10px] font-normal text-violet-600 dark:text-violet-400">
                    {s.category.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-[160px] truncate">
                  {s.provider}
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">
                  ₹{s.awardAmount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(s.deadline).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      s.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-violet-600 hover:underline truncate"
                  >
                    <span className="truncate">{s.sourceUrl.replace("https://", "")}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </td>
                <td className="px-4 py-3 text-[11px] text-zinc-400 whitespace-nowrap">
                  {new Date(s.lastVerifiedAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleEdit(s)}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminScholarshipModal
        scholarshipToEdit={selectedScheme}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // reload window or refresh state
          window.location.reload();
        }}
      />
    </div>
  );
}
