"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Profile } from "@/modules/matrimonial/types"

export default function FamilyTree() {
  const { id } = useParams() as { id: string }
  const t = useTranslations("matrimonial")
  const [tree, setTree] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTree = async () => {
      const res = await fetch(`/api/matrimonial/${id}/family-tree`)
      if (res.ok) {
        const data = await res.json()
        setTree(data)
      }
      setLoading(false)
    }
    fetchTree()
  }, [id])

  if (loading) return <div>{t("loading") ?? "Loading..."}</div>
  if (!tree) return <div>{t("noFamilyData") ?? "No family data"}</div>

  const renderNode = (node: any) => (
    <li key={node.profileId} className="ml-4">
      {node.relation}: {node.profileId}
      {node.children && node.children.length > 0 && (
        <ul>{node.children.map(renderNode)}</ul>
      )}
    </li>
  )

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("familyTreeTitle")}</h1>
      {tree.verified && <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded mb-2">{t("verifiedTag")}</span>}
      <ul>{renderNode(tree.root)}</ul>
    </div>
  )
}
