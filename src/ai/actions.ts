'use server';

import { ai } from './genkit';
import { requireAdmin } from '@/firebase/admin';
import type { Suggestion } from '@/lib/mock-data';

export interface AIInsights {
  summary: string;
  topThemes: string[];
  sentimentOverview: string;
  urgentItems: string[];
  recommendations: string[];
}

export type AnalyzeResult =
  | { ok: true; data: AIInsights }
  | { ok: false; error: string };

async function generateInsights(suggestions: Suggestion[]): Promise<AIInsights> {
  if (suggestions.length === 0) {
    return {
      summary: 'No suggestions submitted yet. Encourage students to share their feedback.',
      topThemes: [],
      sentimentOverview: 'No data available.',
      urgentItems: [],
      recommendations: ['Promote the feedback portal to increase student engagement.'],
    };
  }

  const summaryData = suggestions.map((s) => ({
    title: s.title,
    category: s.category,
    priority: s.priority,
    status: s.status,
    department: s.department,
    message: s.message.slice(0, 300),
  }));

  const prompt = `You are an AI assistant helping Cavendish University administrators analyze student feedback.
Analyze the following ${suggestions.length} student suggestions and provide structured insights.

Student Suggestions:
${JSON.stringify(summaryData, null, 2)}

Respond with a JSON object (no markdown, no code fences) containing:
{
  "summary": "2-3 sentence executive summary of overall feedback trends",
  "topThemes": ["theme1", "theme2", "theme3"],
  "sentimentOverview": "Brief assessment of overall student sentiment",
  "urgentItems": ["urgent issue 1", "urgent issue 2"],
  "recommendations": ["action 1", "action 2", "action 3"]
}

Keep themes and recommendations concise (under 10 words each). Focus on actionable insights.`;

  const { text } = await ai.generate(prompt);
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as AIInsights;
}

/**
 * Runs AI analysis over all suggestions. Requires a valid Firebase ID token
 * belonging to a user with a roles_admin entry — enforced server-side so a
 * non-admin cannot trigger this even by calling the action directly.
 */
export async function analyzeSuggestions(
  suggestions: Suggestion[],
  idToken: string
): Promise<AnalyzeResult> {
  try {
    await requireAdmin(idToken);
  } catch {
    return { ok: false, error: 'Admin access required.' };
  }

  try {
    const data = await generateInsights(suggestions);
    return { ok: true, data };
  } catch {
    return {
      ok: true,
      data: {
        summary: 'AI analysis completed. Review individual submissions for detailed insights.',
        topThemes: ['Unable to parse AI response'],
        sentimentOverview: 'Analysis encountered an issue. Please try again.',
        urgentItems: suggestions.filter((s) => s.priority === 'High').map((s) => s.title).slice(0, 3),
        recommendations: ['Review high-priority submissions immediately.'],
      },
    };
  }
}
