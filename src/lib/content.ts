import { supabase } from "@/integrations/supabase/client";
export type Entry = {
  id: string; kind: string; title: string; body: string; category: string; image_url: string;
  location: string; occurred_on: string | null; metric: string; published: boolean; created_at: string;
};
export async function getEntries(kind?: string) {
  let query = supabase.from("content_entries").select("*").order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return Promise.all(((data ?? []) as Entry[]).map(async entry => {
    if (!entry.image_url) return entry;
    const { data: signed } = await supabase.storage.from("portfolio-media").createSignedUrl(entry.image_url, 3600);
    return { ...entry, image_url: signed?.signedUrl ?? "" };
  }));
}
