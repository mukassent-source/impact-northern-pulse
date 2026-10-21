import { supabase } from "@/integrations/supabase/client";
import { getPublishedMediaUrls } from "./media.functions";
export type Entry = {
  id: string; kind: string; title: string; body: string; category: string; image_url: string;
  location: string; occurred_on: string | null; metric: string; published: boolean; created_at: string; image_path?: string;
};
export async function getEntries(kind?: string) {
  let query = supabase.from("content_entries").select("*").order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  const entries = (data ?? []) as Entry[];
  const publicMedia: Record<string, string> = {};
  const publicIds = entries.filter(entry => entry.published && entry.image_url && !/^(https?:)?\//.test(entry.image_url)).map(entry => entry.id);
  for (let i = 0; i < publicIds.length; i += 100) {
    Object.assign(publicMedia, await getPublishedMediaUrls({ data: { ids: publicIds.slice(i, i + 100) } }));
  }
  return Promise.all(entries.map(async entry => {
    if (!entry.image_url) return entry;
    if (/^(https?:)?\//.test(entry.image_url)) return { ...entry, image_path: entry.image_url };
    if (entry.published) return { ...entry, image_path: entry.image_url, image_url: publicMedia[entry.id] ?? "" };
    const { data: signed } = await supabase.storage.from("portfolio-media").createSignedUrl(entry.image_url, 3600);
    return { ...entry, image_path: entry.image_url, image_url: signed?.signedUrl ?? "" };
  }));
}
