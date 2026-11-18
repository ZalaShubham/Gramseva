"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Profile } from "@/modules/matrimonial/types"

export default function ChatPage() {
  const { id } = useParams() as { id: string } // other participant profile id
  const t = useTranslations("matrimonial")
  const router = useRouter()
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [allowed, setAllowed] = useState(false)

  // Check if interest is accepted between current user and the other profile
  useEffect(() => {
    const checkAccess = async () => {
      const res = await fetch(`/api/matrimonial/${id}/chat-access`)
      if (res.ok) {
        const { allowed: ok } = await res.json()
        setAllowed(ok)
      }
    }
    checkAccess()
  }, [id])

  const sendMessage = async () => {
    if (!input.trim()) return
    // stub: just append locally
    setMessages((m) => [...m, `Me: ${input}`])
    setInput("")
  }

  if (!allowed) return <div>{t("chatAccessDenied") ?? "Chat not available"}</div>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("chatTitle")}</h1>
      <div className="border rounded p-2 h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder={t("chatSendPlaceholder") ?? "Type a message..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border rounded p-1 mb-2"
      />
      <button onClick={sendMessage} className="px-3 py-1 bg-emerald-600 text-white rounded">{t("sendButton") ?? "Send"}</button>
      <button onClick={() => router.back()} className="ml-2 px-3 py-1 bg-gray-300 rounded">Back</button>
    </div>
  )
}
