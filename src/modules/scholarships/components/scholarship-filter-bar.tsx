"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  GraduationCap,
  Sparkles,
  Plane,
  BookOpen,
  Home,
  FileText,
} from "lucide-react";
import { SCHOLARSHIP_CATEGORIES, CLASS_LEVELS, COURSES } from "../types";

interface ScholarshipFilterBarProps {
  currentTab: "active" | "ended";
  currentFilters: {
    search?: string;
    category?: string;
    classLevel?: string;
    course?: string;
    state?: string;
    provider?: string;
  };
}

export function ScholarshipFilterBar({
  currentTab,
  currentFilters,
}: ScholarshipFilterBarProps) {
  const t = useTranslations("scholarships");
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(currentFilters.search || "");
  const [category, setCategory] = useState(currentFilters.category || "ALL");
  const [classLevel, setClassLevel] = useState(currentFilters.classLevel || "ALL");
  const [course, setCourse] = useState(currentFilters.course || "ALL");
  const [state, setState] = useState(currentFilters.state || "ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const applyFilters = (newTab = currentTab, newCategory = category) => {
    const params = new URLSearchParams();
    if (newTab !== "active") params.set("tab", newTab);
    if (search.trim()) params.set("search", search.trim());
    if (newCategory && newCategory !== "ALL") params.set("category", newCategory);
    if (classLevel && classLevel !== "ALL") params.set("classLevel", classLevel);
    if (course && course !== "ALL") params.set("course", course);
    if (state && state !== "ALL") params.set("state", state);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (tab: "active" | "ended") => {
    applyFilters(tab, category);
  };

  const handleCategoryClick = (cat: string) => {
    const nextCat = category === cat ? "ALL" : cat;
    setCategory(nextCat);
    applyFilters(currentTab, nextCat);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("ALL");
    setClassLevel("ALL");
    setCourse("ALL");
    setState("ALL");
    router.push(pathname);
  };

  const categoryChips = [
    { key: "ALL", label: t("filters.allCategories"), icon: GraduationCap },
    { key: "HIGHER_STUDY", label: t("filters.higherStudy"), icon: BookOpen },
    { key: "ABROAD", label: t("filters.abroad"), icon: Plane },
    { key: "COACHING", label: t("filters.coaching"), icon: Sparkles },
    { key: "HOSTEL", label: t("filters.hostel"), icon: Home },
    { key: "PRE_MATRIC", label: t("filters.preMatric"), icon: FileText },
    { key: "POST_MATRIC", label: t("filters.postMatric"), icon: GraduationCap },
  ];

  return (
    <div className="space-y-4">
      {/* Top Row: Tabs + Search + Filter toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Active vs Ended Tabs */}
        <div className="inline-flex rounded-2xl border border-zinc-200 bg-zinc-100/70 p-1 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => handleTabChange("active")}
            className={`rounded-xl px-4 py-2 transition ${
              currentTab === "active"
                ? "bg-white text-violet-700 shadow-xs dark:bg-zinc-800 dark:text-violet-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {t("tabs.active")}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("ended")}
            className={`rounded-xl px-4 py-2 transition ${
              currentTab === "ended"
                ? "bg-white text-violet-700 shadow-xs dark:bg-zinc-800 dark:text-violet-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {t("tabs.ended")}
          </button>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder={t("filters.searchPlaceholder")}
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 shadow-xs placeholder:text-zinc-400 focus:border-violet-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${
              isFilterOpen
                ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
            title="More Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:text-zinc-100"
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categoryChips.map((chip) => {
          const isSelected = category === chip.key;
          const Icon = chip.icon;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => handleCategoryClick(chip.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "border-violet-600 bg-violet-600 text-white shadow-xs"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Multi-Filter Drawer */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-3">
          {/* Class Level */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              {t("filters.classLevel")}
            </label>
            <select
              value={classLevel}
              onChange={(e) => {
                setClassLevel(e.target.value);
                const params = new URLSearchParams(window.location.search);
                if (e.target.value !== "ALL") params.set("classLevel", e.target.value);
                else params.delete("classLevel");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="ALL">{t("filters.allClassLevels")}</option>
              {CLASS_LEVELS.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* Course Stream */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              {t("filters.course")}
            </label>
            <select
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                const params = new URLSearchParams(window.location.search);
                if (e.target.value !== "ALL") params.set("course", e.target.value);
                else params.delete("course");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="ALL">{t("filters.allCourses")}</option>
              {COURSES.map((cr) => (
                <option key={cr} value={cr}>
                  {cr}
                </option>
              ))}
            </select>
          </div>

          {/* State / Region */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              {t("filters.state")}
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                const params = new URLSearchParams(window.location.search);
                if (e.target.value !== "ALL") params.set("state", e.target.value);
                else params.delete("state");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="ALL">{t("filters.allStates")}</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
