"use client"
import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Photo, PhotoPrivacy } from "@/modules/matrimonial/types"

export default function PhotoGallery() {
  const { id } = useParams() as { id: string }
  const t = useTranslations("matrimonial")
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [privacy, setPrivacy] = useState<PhotoPrivacy>(PhotoPrivacy.Public)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const upload = async () => {
    if (!file) return
    // Stub: In a real app we would POST to /api/matrimonial/[id]/photos
    const fakeUrl = URL.createObjectURL(file)
    const newPhoto: Photo = { id: crypto.randomUUID(), url: fakeUrl, privacy }
    setPhotos((p) => [...p, newPhoto])
    setFile(null)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("photoGalleryTitle")}</h1>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {photos.map((p) => (
          <img key={p.id} src={p.url} alt="" className="w-full h-24 object-cover" />
        ))}
      </div>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <select value={privacy} onChange={(e) => setPrivacy(e.target.value as PhotoPrivacy)} className="mr-2">
        <option value={PhotoPrivacy.Public}>{t("photoPrivacyPublic")}</option>
        <option value={PhotoPrivacy.InterestAccepted}>{t("photoPrivacyInterest")}</option>
        <option value={PhotoPrivacy.Private}>{t("photoPrivacyPrivate")}</option>
      </select>
      <button onClick={upload} className="px-3 py-1 bg-emerald-600 text-white rounded">
        {t("addPhotoButton")}
      </button>
      <button onClick={() => router.push(`/matrimonial/${id}`)} className="ml-2 px-3 py-1 bg-gray-300 rounded">
        Back
      </button>
    </div>
  )
}
