import { apiFetch } from '../utils/api';

export type WebsiteAiAnalysis = {
  firmaAdi?: string;
  sektor?: string;
  hizmetIhtiyaci?: string;
  mevcutDurum?: string;
  onerilenHizmetler?: string[];
  teklifNotu?: string;
  kisaAnaliz?: string;
};

type AiAnalyzeProxyResponse = {
  result?: unknown;
  websiteUrl?: string;
};

function stripJsonFence(value: string) {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function parseAiResult(raw: unknown): WebsiteAiAnalysis {
  if (!raw) {
    return {};
  }

  if (typeof raw === 'object') {
    const maybeWrapped = raw as { result?: unknown; data?: unknown; content?: unknown; message?: unknown };
    if (maybeWrapped.result || maybeWrapped.data || maybeWrapped.content || maybeWrapped.message) {
      return parseAiResult(maybeWrapped.result ?? maybeWrapped.data ?? maybeWrapped.content ?? maybeWrapped.message);
    }

    return raw as WebsiteAiAnalysis;
  }

  const text = String(raw);
  try {
    const parsed = JSON.parse(stripJsonFence(text));
    return parseAiResult(parsed);
  } catch {
    return {
      kisaAnaliz: text,
    };
  }
}

export async function analyzeWebsiteWithAI(websiteUrl: string) {
  const response = await apiFetch<AiAnalyzeProxyResponse>('/api/ai/analyze-website', {
    method: 'POST',
    body: JSON.stringify({ websiteUrl }),
  });

  return parseAiResult(response.result ?? response);
}
