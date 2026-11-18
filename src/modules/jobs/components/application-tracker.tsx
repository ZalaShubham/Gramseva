"use client";
import React, { useState } from "react";
import {
  CheckCircle, XCircle, Clock, Calendar, Activity,
  ChevronDown, ChevronRight, ExternalLink, FileText, Edit3
} from "lucide-react";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES } from "../types";
import { SeedJob } from "@/lib/seed-data";

interface AppRecord {
  id: string;
  jobId: string;
  status: string;
  statusNotes?: string;
  notes?: string;
  isExternalTrack: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  job: SeedJob | null;
}

interface ApplicationTrackerProps {
  applications: AppRecord[];
  onStatusUpdate?: (appId: string, status: string, notes: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  INTERVIEW: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  SELECTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  APPLIED: <Clock className="h-3.5 w-3.5" />,
  INTERVIEW: <Calendar className="h-3.5 w-3.5" />,
  SELECTED: <CheckCircle className="h-3.5 w-3.5" />,
  REJECTED: <XCircle className="h-3.5 w-3.5" />,
};

export function ApplicationTracker({ applications, onStatusUpdate }: ApplicationTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSaveStatus(appId: string) {
    if (!onStatusUpdate) return;
    setSaving(true);
    try {
      await onStatusUpdate(appId, editStatus, editNotes);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  // Group by status for kanban-style view
  const grouped = APPLICATION_STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s);
    return acc;
  }, {} as Record<string, AppRecord[]>);

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <Activity className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-3" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No applications yet</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          Apply to jobs on the platform or manually track external government job applications here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Kanban-style status columns */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {APPLICATION_STATUSES.map((status) => (
          <div key={status} className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className={`mb-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[status]}`}>
              {STATUS_ICONS[status]}
              {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS]}
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">{grouped[status].length}</div>
          </div>
        ))}
      </div>

      {/* Application List */}
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
          >
            {/* Summary row */}
            <div className="flex items-center gap-3 p-4">
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold shrink-0 ${STATUS_STYLES[app.status]}`}>
                {STATUS_ICONS[app.status]}
                {APPLICATION_STATUS_LABELS[app.status as keyof typeof APPLICATION_STATUS_LABELS] ?? app.status}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {app.job?.title ?? "Unknown Job"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {app.job?.employerName} • {app.job?.state}
                  {app.isExternalTrack && (
                    <span className="ml-1.5 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                      External Track
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:block text-[11px] text-zinc-400">
                  {new Date(app.createdAt).toLocaleDateString("en-IN")}
                </span>
                {app.job?.officialUrl && (
                  <a
                    href={app.job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-blue-600 dark:border-zinc-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setEditingId(editingId === app.id ? null : app.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-blue-600 dark:border-zinc-700"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-zinc-700"
                >
                  {expandedId === app.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Status update form */}
            {editingId === app.id && onStatusUpdate && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-3">Update Application Status</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={editStatus || app.status}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {APPLICATION_STATUS_LABELS[s as keyof typeof APPLICATION_STATUS_LABELS]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes (interview date, reference, etc.)..."
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
                  />
                  <button
                    onClick={() => handleSaveStatus(app.id)}
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {/* Expanded notes */}
            {expandedId === app.id && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-4">
                {app.statusNotes && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Status Notes</span>
                    <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">{app.statusNotes}</p>
                  </div>
                )}
                {app.notes && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Private Notes</span>
                    <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">{app.notes}</p>
                  </div>
                )}
                {!app.statusNotes && !app.notes && (
                  <p className="text-xs text-zinc-400 italic">No notes added.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}