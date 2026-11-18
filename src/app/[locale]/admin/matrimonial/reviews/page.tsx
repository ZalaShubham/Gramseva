"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export default function AdminReviews() {
  const t = useTranslations("matrimonial")
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const res = await fetch('/api/matrimonial/admin/reviews')
      if (res.ok) setReports(await res.json())
      setLoading(false)
    }
    fetch()
  }, [])

  const suspend = async (profileId: string) => {
    await fetch('/api/matrimonial/admin/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
    })
    // refresh list
    router.refresh()
  }

  if (loading) return <div>{t("loading") ?? "Loading..."}</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("adminReviewsTitle")}</h1>
      {reports.pendingReports && reports.pendingReports.length > 0 ? (
        <ul>
          {reports.pendingReports.map((r:any) => (
            <li key={r.id} className="mb-2 border p-2 rounded">
              <p><strong>{t("reportButton")}</strong>: {r.reason}</p>
              <button onClick={() => suspend(r.reportedUserId)} className="px-2 py-1 bg-red-600 text-white rounded">
                {t("suspendButton")}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending reports</p>
      )}
    </div>
  )
}
