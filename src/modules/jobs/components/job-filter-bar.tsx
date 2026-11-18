"use client";
import React, { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { JOB_CATEGORIES, CATEGORY_LABELS, JOB_QUALIFICATIONS, QUALIFICATION_LABELS, JOB_QUOTAS, QUOTA_LABELS, JOB_TYPES, JOB_TYPE_LABELS, JOB_SECTORS, SECTOR_LABELS } from "../types";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

interface JobFilterBarProps {
  currentTab: string;
  currentFilters: {
    search?: string;
    sector?: string;
    jobType?: string;
    qualification?: string;
    quota?: string;
    state?: string;
    category?: string;
  };
}

export function JobFilterBar({ currentTab, currentFilters }: JobFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState(currentFilters.search ?? "");

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    if (currentTab !== "all") params.set("tab", currentTab);
    const merged = { ...currentFilters, search, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v.trim() !== "") params.set(k, v);
    }
    return `${pathname}?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => router.push(buildUrl({})));
  }

  function handleFilter(key: string, value: string) {
    startTransition(() => router.push(buildUrl({ [key]: value || undefined })));
  }

  function handleReset() {
    setSearch("");
    startTransition(() => router.push(pathname));
  }

  const hasFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="space-y-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="job-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, employers, keywords..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-900/30"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          disabled={isPending}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-zinc-700 transition hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          <ChevronDown className={`h-3.5 w-3.5 transition ${showAdvanced ? "rotate-180" : ""}`} />
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
          >
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {/* Sector */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Sector</label>
              <select
                id="filter-sector"
                value={currentFilters.sector ?? ""}
                onChange={(e) => handleFilter("sector", e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">All Sectors</option>
                {JOB_SECTORS.map((s) => (
                  <option key={s} value={s}>{SECTOR_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Job Type</label>
              <select
                id="filter-jobType"
                value={currentFilters.jobType ?? ""}
                onChange={(e) => handleFilter("jobType", e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">All Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{JOB_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Qualification</label>
              <select
                id="filter-qualification"
                value={currentFilters.qualification ?? ""}
                onChange={(e) => handleFilter("qualification", e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">Any Qualification</option>
                {JOB_QUALIFICATIONS.filter((q) => q !== "ANY").map((q) => (
                  <option key={q} value={q}>{QUALIFICATION_LABELS[q]}</option>
                ))}
              </select>
            </div>

            {/* Quota */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Quota</label>
              <select
                id="filter-quota"
                value={currentFilters.quota ?? ""}
                onChange={(e) => handleFilter("quota", e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">All Quotas</option>
                {JOB_QUOTAS.map((q) => (
                  <option key={q} value={q}>{QUOTA_LABELS[q]}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">State</label>
              <select
                id="filter-state"
                value={currentFilters.state ?? ""}
                onChange={(e) => handleFilter("state", e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-5">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleFilter("category", "")}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${!currentFilters.category ? "border-blue-500 bg-blue-600 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}`}
                >
                  All
                </button>
                {JOB_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilter("category", cat)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${currentFilters.category === cat ? "border-blue-500 bg-blue-600 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}