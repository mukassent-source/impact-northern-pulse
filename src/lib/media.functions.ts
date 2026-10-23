import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { canSignPublishedMedia, publishedMediaRequest, PUBLIC_MEDIA_URL_SECONDS } from "./media-access";

export const getPublishedMediaUrls = createServerFn({ method: "POST" })
  .inputValidator(input => publishedMediaRequest.parse(input))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    if (!data.ids.length) return {};
    const origin = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!origin || !key) throw new Error("Media is temporarily unavailable.");
    const publicClient = createClient<Database>(origin, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    // Authorize the exact record IDs with anonymous RLS before privileged signing.
    // No caller-provided storage path is ever passed to the signing client.
    const { data: entries, error } = await publicClient.from("content_entries")
      .select("id,image_url,published,media_paths").in("id", data.ids).eq("published", true);
    if (error) throw new Error("Media is temporarily unavailable.");
    const eligible = (entries ?? []).filter(canSignPublishedMedia);
    if (!eligible.length) return {};
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result: Record<string, string> = {};
    const jobs = eligible.flatMap(entry => [
      { key: entry.id, path: entry.image_url },
      ...(entry.media_paths ?? []).slice(0, 20)
        .map((path, i) => ({ key: `${entry.id}:${i}`, path }))
        .filter(job => canSignPublishedMedia({ published: true, image_url: job.path })),
    ]);
    await Promise.all(jobs.map(async job => {
      const { data: signed, error: signError } = await supabaseAdmin.storage
        .from("portfolio-media").createSignedUrl(job.path, PUBLIC_MEDIA_URL_SECONDS);
      if (!signError && signed?.signedUrl) {
        const browserOrigin = process.env["VITE_SUPABASE_URL"];
        const url = new URL(signed.signedUrl);
        result[job.key] = browserOrigin ? `${browserOrigin}${url.pathname}${url.search}` : signed.signedUrl;
      }
    }));
    return result;
  });