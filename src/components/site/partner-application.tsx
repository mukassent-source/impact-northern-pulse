import { useState } from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactSchema, sendContact } from "@/lib/contact.functions";

const field = "h-12 w-full rounded-sm border border-input bg-background px-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage";

export function PartnerApplication() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("");
    const form = e.currentTarget;
    const v = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const message = [`Partnership type: ${v.type || "Not specified"}`, `Website: ${v.website || "Not provided"}`, "", "Goals:", v.goals ?? "", "", "Proposed collaboration:", v.proposal || "Not provided"].join("\n");
    const parsed = contactSchema.safeParse({ name: v.name, email: v.email, phone: v.phone ?? "", organization: v.organization ?? "", subject: `Partnership application${v.organization ? ` — ${v.organization}` : ""}`.slice(0, 160), message });
    if (!parsed.success || !v.organization || (v.goals ?? "").trim().length < 20) { setStatus("Please complete the required fields (goals: at least 20 characters)."); return; }
    setBusy(true);
    try { await sendContact({ data: parsed.data }); form.reset(); setStatus("Thank you. Your partnership application has been received and will be reviewed."); }
    catch { setStatus("Your application could not be sent right now. Please try again later."); }
    finally { setBusy(false); }
  }
  return <div className="mb-16 border border-border bg-card p-6 md:p-10">
    <p className="eyebrow flex items-center gap-2 text-sage"><Handshake size={14}/> Partnership application</p>
    <h2 className="editorial-heading mt-4 text-3xl md:text-4xl">Propose a partnership.</h2>
    <p className="mt-3 max-w-2xl text-muted-foreground">Share your organization's details and goals. Every application is reviewed personally.</p>
    <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
      {[["Full name *","name","text",true,100],["Email *","email","email",true,255],["Organization *","organization","text",true,150],["Phone","phone","tel",false,40],["Website","website","url",false,200]].map(([l,n,t,r,m])=>
        <label key={String(n)}><span className="mb-2 block text-sm font-semibold">{l}</span><input name={String(n)} type={String(t)} required={Boolean(r)} maxLength={Number(m)} className={field}/></label>)}
      <label><span className="mb-2 block text-sm font-semibold">Partnership type</span><select name="type" className={field}>{["Youth development","Media development","Community engagement","Speaking / event","Sponsorship / funding","Other"].map(o=><option key={o}>{o}</option>)}</select></label>
      <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Your goals *</span><textarea name="goals" required minLength={20} maxLength={1200} rows={4} className="w-full rounded-sm border border-input bg-background p-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage"/></label>
      <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Proposed collaboration</span><textarea name="proposal" maxLength={1200} rows={3} className="w-full rounded-sm border border-input bg-background p-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage"/></label>
      <div className="sm:col-span-2"><div aria-live="polite" className="mb-4 text-sm text-sage">{status}</div><Button type="submit" disabled={busy} size="lg" className="h-12 rounded-sm px-8">{busy ? "Submitting..." : "Submit application"}<ArrowRight/></Button></div>
    </form>
  </div>;
}
