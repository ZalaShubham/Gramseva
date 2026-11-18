"use client";
import React, { useState } from "react";
import { Plus, Trash2, Download, Save, CheckCircle, GraduationCap, Briefcase, Wrench } from "lucide-react";
import { ResumeInput, ResumeEducationItem, ResumeExperienceItem, QUALIFICATION_LABELS, JOB_QUALIFICATIONS } from "../types";

interface ResumeBuilderProps {
  initialData?: Partial<ResumeInput>;
  resumeId?: string;
  onSave?: (data: ResumeInput) => Promise<void>;
}

const emptyEdu: ResumeEducationItem = { degree: "", institute: "", year: "", marks: "" };
const emptyExp: ResumeExperienceItem = { title: "", company: "", duration: "", description: "" };

export function ResumeBuilder({ initialData, resumeId, onSave }: ResumeBuilderProps) {
  const [form, setForm] = useState<ResumeInput>({
    title: "Primary Resume",
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    qualification: "GRADUATE",
    education: [{ ...emptyEdu }],
    experience: [],
    skills: [],
    experienceYears: 0,
    isDefault: true,
    ...initialData,
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField<K extends keyof ResumeInput>(key: K, value: ResumeInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Education CRUD
  function addEdu() {
    setForm((prev) => ({ ...prev, education: [...(prev.education ?? []), { ...emptyEdu }] }));
  }
  function updateEdu(idx: number, key: keyof ResumeEducationItem, value: string) {
    const arr = [...(form.education ?? [])];
    arr[idx] = { ...arr[idx], [key]: value };
    setForm((prev) => ({ ...prev, education: arr }));
  }
  function removeEdu(idx: number) {
    setForm((prev) => ({ ...prev, education: (prev.education ?? []).filter((_, i) => i !== idx) }));
  }

  // Experience CRUD
  function addExp() {
    setForm((prev) => ({ ...prev, experience: [...(prev.experience ?? []), { ...emptyExp }] }));
  }
  function updateExp(idx: number, key: keyof ResumeExperienceItem, value: string) {
    const arr = [...(form.experience ?? [])];
    arr[idx] = { ...arr[idx], [key]: value };
    setForm((prev) => ({ ...prev, experience: arr }));
  }
  function removeExp(idx: number) {
    setForm((prev) => ({ ...prev, experience: (prev.experience ?? []).filter((_, i) => i !== idx) }));
  }

  // Skills
  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || (form.skills ?? []).includes(trimmed)) return;
    setForm((prev) => ({ ...prev, skills: [...(prev.skills ?? []), trimmed] }));
    setSkillInput("");
  }
  function removeSkill(skill: string) {
    setForm((prev) => ({ ...prev, skills: (prev.skills ?? []).filter((s) => s !== skill) }));
  }

  async function handleSave() {
    if (!form.fullName.trim()) {
      setErrors({ fullName: "Full name is required" });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await onSave?.(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const inputClass = "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-900/30";
  const labelClass = "mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300";
  const sectionHeaderClass = "flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800";

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Resume Builder</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Build your professional profile to apply for jobs on the platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 transition hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition disabled:opacity-60 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Resume"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form Panel */}
        <div className="space-y-6 lg:col-span-3">

          {/* Basic Info */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className={sectionHeaderClass}>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-black">1</span>
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Resume Title</label>
                <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Primary Resume, Government Job Resume" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Your full name as on certificates" className={`${inputClass} ${errors.fullName ? "border-red-400" : ""}`} />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email ?? ""} onChange={(e) => updateField("email", e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Professional Summary</label>
                <textarea value={form.summary ?? ""} onChange={(e) => updateField("summary", e.target.value)} placeholder="Brief professional summary (max 500 chars)..." rows={3} maxLength={500} className={`${inputClass} resize-none`} />
                <p className="mt-1 text-[11px] text-zinc-400">{(form.summary ?? "").length}/500</p>
              </div>
              <div>
                <label className={labelClass}>Highest Qualification (for job matching)</label>
                <select value={form.qualification ?? "GRADUATE"} onChange={(e) => updateField("qualification", e.target.value)} className={inputClass}>
                  {JOB_QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{QUALIFICATION_LABELS[q]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Years of Experience</label>
                <input type="number" min={0} max={50} value={form.experienceYears ?? 0} onChange={(e) => updateField("experienceYears", Number(e.target.value))} className={inputClass} />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className={sectionHeaderClass}>
              <GraduationCap className="h-5 w-5 text-violet-600" />
              Education
            </h3>
            <div className="space-y-4">
              {(form.education ?? []).map((edu, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Education {idx + 1}</span>
                    {(form.education ?? []).length > 1 && (
                      <button onClick={() => removeEdu(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Degree / Qualification</label>
                      <input type="text" value={edu.degree} onChange={(e) => updateEdu(idx, "degree", e.target.value)} placeholder="e.g. B.A. (Economics), B.Tech (CS), 10th SSC" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input type="text" value={edu.institute} onChange={(e) => updateEdu(idx, "institute", e.target.value)} placeholder="College / School name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Year of Passing</label>
                      <input type="text" value={edu.year} onChange={(e) => updateEdu(idx, "year", e.target.value)} placeholder="e.g. 2022" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Marks / CGPA</label>
                      <input type="text" value={edu.marks ?? ""} onChange={(e) => updateEdu(idx, "marks", e.target.value)} placeholder="e.g. 78% or 7.8 CGPA" className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEdu} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <Plus className="h-4 w-4" /> Add Education
              </button>
            </div>
          </section>

          {/* Experience */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className={sectionHeaderClass}>
              <Briefcase className="h-5 w-5 text-emerald-600" />
              Work Experience
            </h3>
            <div className="space-y-4">
              {(form.experience ?? []).length === 0 && (
                <p className="text-xs text-zinc-400 italic mb-2">No experience added. Fresher? Leave blank.</p>
              )}
              {(form.experience ?? []).map((exp, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Experience {idx + 1}</span>
                    <button onClick={() => removeExp(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input type="text" value={exp.title} onChange={(e) => updateExp(idx, "title", e.target.value)} placeholder="e.g. Junior Engineer" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Company / Organization</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExp(idx, "company", e.target.value)} placeholder="e.g. State PWD Dept." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Duration</label>
                      <input type="text" value={exp.duration} onChange={(e) => updateExp(idx, "duration", e.target.value)} placeholder="e.g. Jun 2021 – Mar 2023" className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Description (optional)</label>
                      <textarea value={exp.description ?? ""} onChange={(e) => updateExp(idx, "description", e.target.value)} placeholder="Key responsibilities and achievements..." rows={2} className={`${inputClass} resize-none`} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addExp} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <Plus className="h-4 w-4" /> Add Experience
              </button>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className={sectionHeaderClass}>
              <Wrench className="h-5 w-5 text-orange-600" />
              Skills
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill (press Enter or click Add)..."
                className={inputClass}
              />
              <button onClick={addSkill} className="rounded-xl bg-orange-100 px-4 py-2 text-xs font-bold text-orange-800 hover:bg-orange-200 dark:bg-orange-950/40 dark:text-orange-300">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {(form.skills ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(form.skills ?? []).map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1 text-zinc-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 print:shadow-none" id="resume-preview">
              <div className="border-b border-zinc-200 pb-4 mb-4 dark:border-zinc-800">
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{form.fullName || "Your Name"}</h2>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {form.email && <span>{form.email}</span>}
                  {form.phone && <span>{form.phone}</span>}
                </div>
              </div>

              {form.summary && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1">Summary</h4>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{form.summary}</p>
                </div>
              )}

              {(form.education ?? []).filter((e) => e.degree).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Education</h4>
                  {(form.education ?? []).filter((e) => e.degree).map((edu, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{edu.degree}</p>
                      <p className="text-xs text-zinc-500">{edu.institute} {edu.year && `• ${edu.year}`} {edu.marks && `• ${edu.marks}`}</p>
                    </div>
                  ))}
                </div>
              )}

              {(form.experience ?? []).filter((e) => e.title).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Experience</h4>
                  {(form.experience ?? []).filter((e) => e.title).map((exp, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{exp.title}</p>
                      <p className="text-xs text-zinc-500">{exp.company} {exp.duration && `• ${exp.duration}`}</p>
                      {exp.description && <p className="text-xs text-zinc-500 mt-0.5">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {(form.skills ?? []).length > 0 && (
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(form.skills ?? []).map((skill) => (
                      <span key={skill} className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}