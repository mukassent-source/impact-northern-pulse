import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

type Row = { kind: string; title: string; body: string; category: string; location: string };

async function loadPortfolio(): Promise<Row[]> {
  const base = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!base || !key) return [];
  const url = `${base}/rest/v1/content_entries?select=kind,title,body,category,location&published=eq.true&kind=in.(project,achievement,event,insight,impact)&limit=60`;
  const res = await fetch(url, { headers: { apikey: key } });
  if (!res.ok) return [];
  return (await res.json()) as Row[];
}

export async function recommendCollaborations(goals: string, organization: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("The recommendation service is not configured.");
  const rows = await loadPortfolio();
  const portfolio = rows.length
    ? rows.map((r) => `- [${r.kind}] ${r.title}${r.category ? ` (${r.category})` : ""}${r.location ? `, ${r.location}` : ""}: ${r.body.slice(0, 300)}`).join("\n")
    : "(No published portfolio records yet.)";

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: `You help prospective partners find collaboration opportunities with Samuel Ato Afful, a strategic media development and youth empowerment leader in Northern Ghana with 24+ years in strategic communications, corporate affairs, marketing communications, media/broadcasting and organizational leadership.
Core areas: Strategic Media Development, Youth Empowerment, Community Engagement, Leadership & Strategy, Digital Innovation, Social Impact, Speaking engagements.
Published portfolio records:
${portfolio}

Write as a senior partnerships advisor in a polished, executive, third-person voice (refer to "Samuel"), suitable for NGOs, development partners, government and corporate readers.
Recommend 3 to 4 concrete collaboration opportunities matched to the partner's goals. Format each as:
1. Opportunity title
Two or three precise sentences on strategic fit, what the collaboration could involve, and which portfolio items or areas it builds on.
Prefer published portfolio records when relevant; otherwise anchor in the core areas. Never invent statistics, past partners, awards, outcomes or commitments; use conditional language ("could", "would") for proposals. Avoid hype, exclamation marks, emojis and markdown symbols. Keep the whole answer under 300 words. Close with one sentence inviting them to submit a partnership application or use the contact page.`,
    prompt: `Organization: ${organization || "Not specified"}\nGoals: ${goals}`,
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
  });
  return await result.text;
}
