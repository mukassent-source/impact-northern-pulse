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
  return (data ?? []) as Entry[];
}
