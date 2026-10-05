import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPartnerMatches, partnerMatchSchema } from "@/lib/partner-match.functions";

export function PartnerMatch() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setResult("");
    const parsed = partnerMatchSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget).entries()));
    if (!parsed.success) { setError("Please describe your goals in at least 20 characters."); return; }
    setBusy(true);
    try {
      const r = await getPartnerMatches({ data: parsed.data });
      if ("error" in r && r.error) setError(r.error); else setResult(r.text ?? "");
    } catch { setError("Recommendations could not be generated. Please try again later."); }
    finally { setBusy(false); }
  }
  return <div className="mb-16 border border-border bg-card p-6 md:p-10">
    <p className="eyebrow flex items-center gap-2 text-sage"><Sparkles size={14}/> AI-powered partnership finder</p>
    <h2 className="editorial-heading mt-4 text-3xl md:text-4xl">Find where we can work together.</h2>
    <p className="mt-3 max-w-2xl text-muted-foreground">Describe your organization's goals and receive suggested collaboration opportunities drawn from Samuel's portfolio.</p>
    <form onSubmit={submit} className="mt-8 grid gap-5">
      <label><span className="mb-2 block text-sm font-semibold">Organization</span><input name="organization" maxLength={150} className="h-12 w-full rounded-sm border border-input bg-background px-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage"/></label>
      <label><span className="mb-2 block text-sm font-semibold">Your goals *</span><textarea name="goals" required minLength={20} maxLength={2000} rows={5} placeholder="e.g. We want to train young journalists in Tamale and grow community radio reach..." className="w-full rounded-sm border border-input bg-background p-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage"/></label>
      <div><Button type="submit" disabled={busy} size="lg" className="h-12 rounded-sm px-8">{busy ? "Finding opportunities..." : "Get recommendations"}<ArrowRight/></Button></div>
    </form>
    <div aria-live="polite">
      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
      {result && <div className="mt-8 border-l-2 border-gold pl-6"><p className="whitespace-pre-line leading-8">{result}</p><Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sage">Start the conversation <ArrowRight size={16}/></Link></div>}
    </div>
  </div>;
}
