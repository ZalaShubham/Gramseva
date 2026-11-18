"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Profile } from "@/modules/matrimonial/types"

export default function MatrimonialProfile() {
  const { id } = useParams() as { id: string }
  const t = useTranslations("matrimonial")
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/matrimonial/${id}`)
      if (!res.ok) {
        setError("Failed to load profile")
        return
      }
      const data = await res.json()
      setProfile(data)
    }
    fetchProfile()
  }, [id])

  if (error) return <div>{error}</div>
  if (!profile) return <div>{t("loading") ?? "Loading..."}</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("profileTitle")}</h1>
      <p><strong>{t("nameLabel")}: </strong>{profile.name}</p>
      <p><strong>{t("genderLabel")}: </strong>{profile.gender}</p>
      <p><strong>{t("dobLabel")}: </strong>{profile.dateOfBirth}</p>
      <p><strong>{t("subCasteLabel")}: </strong>{profile.subCaste}</p>
      {/* Links to sub‑pages */}
      <div className="mt-4 space-x-2">
        <button onClick={() => router.push(`/matrimonial/${id}/photos`)} className="px-3 py-1 bg-emerald-600 text-white rounded">{t("photoGalleryTitle")}</button>
        <button onClick={() => router.push(`/matrimonial/${id}/family`)} className="px-3 py-1 bg-emerald-600 text-white rounded">{t("familyTreeTitle")}</button>
        <button onClick={() => router.push(`/matrimonial/${id}/preference`)} className="px-3 py-1 bg-emerald-600 text-white rounded">{t("partnerPreferenceTitle")}</button>
      </div>
    </div>
  )
}
