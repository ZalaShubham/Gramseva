// src/lib/ai.ts
/**
 * AI Help Chatbox service
 * Uses Gemini (or any LLM) to answer queries with retrieval over platform content.
 * Enforces refusal rules for legal/medical/financial advice and never leaks private data.
 * Supports English, Hindi, Gujarati.
 */
import { GeminiClient } from '@/lib/gemini'; // assumes existing Gemini client wrapper
import { retrieveRelevantDocs } from '@/lib/search'; // stub implementation will be added later

export interface ChatRequest {
  userId: string;
  query: string;
  language?: 'en' | 'hi' | 'gu';
}

export interface ChatResponse {
  answer: string;
  sources: Array<{ title: string; url: string }>;
}

// Simple regex to detect disallowed topics
const REFUSE_REGEX = /(legal advice|medical advice|financial advice)/i;

/**
 * Detect language based on Unicode ranges. Falls back to English.
 */
function detectLanguage(text: string): 'en' | 'hi' | 'gu' {
  const gu = /[\u0A80-\u0AFF]/; // Gujarati block
  const hi = /[\u0900-\u097F]/; // Devanagari (Hindi) block
  if (gu.test(text)) return 'gu';
  if (hi.test(text)) return 'hi';
  return 'en';
}

// In‑memory simple rate‑limit: max 20 queries per user per 24h (configurable)
const RATE_LIMIT = 20;
const userCounts: Record<string, { date: string; count: number }> = {};
function checkRateLimit(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = userCounts[userId];
  if (!entry || entry.date !== today) {
    userCounts[userId] = { date: today, count: 1 };
    return;
  }
  if (entry.count >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again tomorrow.');
  }
  entry.count++;
}

export async function askAI(req: ChatRequest): Promise<ChatResponse> {
  // Rate limit first
  checkRateLimit(req.userId);

  const lang = req.language ?? detectLanguage(req.query);
  // Retrieve context documents (stub will return empty array until implemented)
  const docs = await retrieveRelevantDocs(req.query, lang);

  const systemPrompt = `You are an assistant for the Gramseva platform. Answer in ${lang}.
Do not give legal, medical, or financial advice. If asked, reply with "I cannot provide that information; please refer to official help pages."
Never reveal private user data.
Cite sources with their URLs.
Context:\n${docs.map(d => `- ${d.title}: ${d.url}`).join('\n')}`;

  const raw = await GeminiClient.chat({
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: req.query }],
    temperature: 0.2,
  });

  // Safety check on the raw answer
  if (REFUSE_REGEX.test(raw)) {
    return { answer: 'I cannot provide that information; please refer to official help pages.', sources: [] };
  }

  const answer = raw.trim();
  const sources = docs.map(d => ({ title: d.title, url: d.url }));
  return { answer, sources };
}
