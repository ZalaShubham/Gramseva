// src/lib/search.ts
/**
 * Simple search/retrieval stub for the AI chatbox.
 * In a full implementation this would query a vector store or full‑text index of
 * platform content (scholarships, jobs, politicians, help pages, legal pages).
 * For now it returns an empty array to keep the chat functional.
 */
export interface Doc {
  id: string;
  title: string;
  url: string;
  lang: 'en' | 'hi' | 'gu';
  content: string;
}

/** Retrieve documents relevant to a query.
 *  @param query The user query.
 *  @param lang   Preferred language (optional).
 *  @returns     Array of matching docs (empty stub).
 */
export async function retrieveRelevantDocs(query: string, lang?: 'en' | 'hi' | 'gu'): Promise<Doc[]> {
  // TODO: integrate a real search backend. For now we return an empty list.
  return [];
}
