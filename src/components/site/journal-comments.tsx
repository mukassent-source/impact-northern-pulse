import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function JournalComments({ entryId }: { entryId: string }) {
  const qc = useQueryClient();
  const key = ["journal-comments", entryId];
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { data = [] } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_comments").select("*").eq("entry_id", entryId).order("created_at");
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin");
      setIsAdmin(!!r?.length);
    });
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const body = String(fd.get("body") || "").trim();
    if (!name || name.length > 80 || !body || body.length > 2000) { setNotice("Please add your name and a comment (up to 2000 characters)."); return; }
    setBusy(true);
    const { error } = await supabase.from("journal_comments").insert({ entry_id: entryId, name, body });
    setBusy(false);
    if (error) { setNotice("Your comment could not be posted. Please try again."); return; }
    form.reset();
    setNotice("Thank you — your comment is posted.");
    qc.invalidateQueries({ queryKey: key });
  }
  async function remove(id: string) {
    await supabase.from("journal_comments").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: key });
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <button type="button" onClick={() => setOpen(!open)} className="text-sm font-semibold text-foreground underline-offset-4 hover:underline">
        {open ? "Hide comments" : `Comments (${data.length})`}
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          {data.map((c) => (
            <div key={c.id} className="border-l-2 border-gold pl-3">
              <p className="text-xs font-semibold">{c.name} <span className="font-normal text-muted-foreground">· {new Date(c.created_at).toLocaleDateString()}</span></p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{c.body}</p>
              {isAdmin && <button type="button" onClick={() => remove(c.id)} className="mt-1 text-xs text-destructive">Delete</button>}
            </div>
          ))}
          <form onSubmit={submit} className="grid gap-2">
            <input name="name" maxLength={80} required placeholder="Your name" aria-label="Your name" className="h-10 border border-input bg-background px-3 text-sm" />
            <textarea name="body" maxLength={2000} required rows={3} placeholder="Write a comment" aria-label="Comment" className="border border-input bg-background p-3 text-sm" />
            <Button type="submit" size="sm" disabled={busy} className="justify-self-start rounded-sm">{busy ? "Posting..." : "Post comment"}</Button>
            <p role="status" className="text-xs text-sage">{notice}</p>
          </form>
        </div>
      )}
    </div>
  );
}
