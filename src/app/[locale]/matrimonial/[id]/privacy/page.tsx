"use client"
import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Profile } from "@/modules/matrimonial/types"

export default function PrivacySettings() {
  const { id } = useParams() as { id: string }
  const t = useTranslations("matrimonial")
  const router = useRouter()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const res = await fetch(`/api/matrimonial/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSettings(data.privacySettings)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return <div>{t("loading") ?? "Loading..."}</div>
  if (!settings) return <div>{t("errorLoading") ?? "Error loading settings"}</div>

  const toggle = (field: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = async () => {
    await fetch(`/api/matrimonial/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privacySettings: settings }),
    })
    router.back()
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("privacySettingsTitle")}</h1>
      <label className="block mb-2">
        <input type="checkbox" checked={settings.showPhone} onChange={() => toggle('showPhone')} /> {t("showPhone")}
      </label>
      <label className="block mb-2">
        <input type="checkbox" checked={settings.showFamilyTree} onChange={() => toggle('showFamilyTree')} /> {t("showFamilyTree")}
      </label>
      <label className="block mb-2">
        <input type="checkbox" checked={settings.showSocialLinks} onChange={() => toggle('showSocialLinks')} /> {t("showSocialLinks")}
      </label>
      <label className="block mb-2">
        {t("defaultPhotoPrivacy")}: 
        <select value={settings.photoPrivacy} onChange={(e) => setSettings((p: any) => ({ ...p, photoPrivacy: e.target.value }))}>
          <option value="public">{t("photoPrivacyPublic")}</option>
          <option value="interestAccepted">{t("photoPrivacyInterest")}</option>
          <option value="private">{t("photoPrivacyPrivate")}</option>
        </select>
      </label>
      <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded">{t("saveButton") ?? "Save"}</button>
    </div>
  )
}
