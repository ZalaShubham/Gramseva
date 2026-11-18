"use client";
import React, { useState } from "react";
import { Building2, Plus, Edit3, Users, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { SeedJob, SeedEmployer } from "@/lib/seed-data";
import { JobPostInput, JobPostSchema, JOB_SECTORS, JOB_TYPES, WORKPLACE_TYPES, JOB_CATEGORIES, CATEGORY_LABELS, JOB_QUALIFICATIONS, QUALIFICATION_LABELS } from "../types";

interface EmployerPanelProps {
  employer: (SeedEmployer & { isApproved: boolean }) | null;
  jobs: SeedJob[];
  onPostJob?: (data: JobPostInput) => Promise<void>;
  onRegister?: (data: Record<string, string>) => Promise<void>;
}

const inputClass = "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";
const labelClass = "mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300";

export function EmployerPanel({ employer, jobs, onPostJob, onRegister }: EmployerPanelProps) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<Partial<JobPostInput>>({
    sector: "PRIVATE",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    qualification: "GRADUATE",
    isReservedForScSt: false,
    vacancies: 1,
    isExternal: false,
    howToApplySteps: ["Apply via official portal", "Upload required documents"],
  });

  const [stepsInput, setStepsInput] = useState((form.howToApplySteps ?? []).join("\n"));

  function updateField(key: keyof JobPostInput, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const steps = stepsInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const data = { ...form, howToApplySteps: steps };

    const parsed = JobPostSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      await onPostJob?.(parsed.data);
      setShowPostForm(false);
      setForm({});
    } finally {
      setSaving(false);
    }
  }

  if (!employer) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
        <Building2 className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-3" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Register as an Employer</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
          Submit your company details for admin review. Once approved, you can post job listings and view applicants.
        </p>
        <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg px-3 py-2 inline-block">
          ⚠️ Unapproved employers cannot publish jobs. Admin approval required.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Approval Status Banner */}
      {!employer.isApproved && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-700 dark:bg-amber-950/30">
          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Awaiting Admin Approval</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Your employer account is under review. You will be notified once approved and can then post jobs.
            </p>
          </div>
        </div>
      )}

      {employer.isApproved && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 dark:border-emerald-700 dark:bg-emerald-950/30">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{employer.companyName} — Approved Employer</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {employer.industry} • {employer.city}, {employer.state}
            </p>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Posted Jobs ({jobs.length})</h3>
        {employer.isApproved && (
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Post New Job
          </button>
        )}
      </div>

      {/* Post Job Form */}
      {showPostForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-5">
          <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Post a New Job</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Job Title *</label>
              <input type="text" value={form.title ?? ""} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Software Engineer, Data Entry Operator" className={inputClass} />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={form.category ?? ""} onChange={(e) => updateField("category", e.target.value)} className={inputClass}>
                <option value="">Select Category</option>
                {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sector *</label>
              <select value={form.sector ?? "PRIVATE"} onChange={(e) => updateField("sector", e.target.value as any)} className={inputClass}>
                {JOB_SECTORS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Job Type</label>
              <select value={form.jobType ?? "FULL_TIME"} onChange={(e) => updateField("jobType", e.target.value as any)} className={inputClass}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Workplace</label>
              <select value={form.workplaceType ?? "ON_SITE"} onChange={(e) => updateField("workplaceType", e.target.value as any)} className={inputClass}>
                {WORKPLACE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Qualification</label>
              <select value={form.qualification ?? "ANY"} onChange={(e) => updateField("qualification", e.target.value)} className={inputClass}>
                {JOB_QUALIFICATIONS.map((q) => <option key={q} value={q}>{QUALIFICATION_LABELS[q]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Vacancies</label>
              <input type="number" min={1} value={form.vacancies ?? 1} onChange={(e) => updateField("vacancies", Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <input type="text" value={form.state ?? ""} onChange={(e) => updateField("state", e.target.value)} placeholder="e.g. Gujarat" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" value={form.city ?? ""} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g. Ahmedabad" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Min Salary (₹/year)</label>
              <input type="number" value={form.minSalary ?? ""} onChange={(e) => updateField("minSalary", Number(e.target.value))} placeholder="e.g. 400000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Salary (₹/year)</label>
              <input type="number" value={form.maxSalary ?? ""} onChange={(e) => updateField("maxSalary", Number(e.target.value))} placeholder="e.g. 800000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Application Deadline *</label>
              <input type="datetime-local" value={form.deadline ? form.deadline.slice(0, 16) : ""} onChange={(e) => updateField("deadline", new Date(e.target.value).toISOString())} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Source / Official URL *</label>
              <input type="url" value={form.sourceUrl ?? ""} onChange={(e) => updateField("sourceUrl", e.target.value)} placeholder="https://..." className={inputClass} />
              {errors.sourceUrl && <p className="mt-1 text-xs text-red-600">{errors.sourceUrl}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea value={form.description ?? ""} onChange={(e) => updateField("description", e.target.value)} placeholder="Job description, duties, and responsibilities..." rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Requirements *</label>
              <textarea value={form.requirements ?? ""} onChange={(e) => updateField("requirements", e.target.value)} placeholder="Required skills, experience, certificates..." rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>How to Apply Steps (one per line)</label>
              <textarea value={stepsInput} onChange={(e) => setStepsInput(e.target.value)} placeholder={"Step 1: Visit official portal\nStep 2: Fill application form\nStep 3: Upload documents"} rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="reserved-sts" checked={form.isReservedForScSt ?? false} onChange={(e) => updateField("isReservedForScSt", e.target.checked)} className="h-4 w-4 rounded" />
              <label htmlFor="reserved-sts" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">This job has SC/ST reserved quota</label>
            </div>
            {form.isReservedForScSt && (
              <div>
                <label className={labelClass}>Target Community</label>
                <select value={form.targetCommunity ?? ""} onChange={(e) => updateField("targetCommunity", e.target.value as any || null)} className={inputClass}>
                  <option value="">Both SC & ST</option>
                  <option value="SC">SC only</option>
                  <option value="ST">ST only</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Posting..." : "Publish Job"}
            </button>
            <button type="button" onClick={() => setShowPostForm(false)} className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-sm text-zinc-500">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{job.title}</p>
                <p className="text-xs text-zinc-500">{job.city}, {job.state} • {job.vacancies} vacanc{job.vacancies > 1 ? "ies" : "y"}</p>
              </div>
              <div className={`rounded-lg px-2 py-1 text-[11px] font-bold ${job.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                {job.status ?? "ACTIVE"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}