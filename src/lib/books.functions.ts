import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bookSchema, canReadFullBook } from "./books";

export type PublicBook = { id: string; title: string; description: string; price_amount: number; currency: string; cover_url: string };

function publicClient() {
  const origin = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!origin || !key) throw new Error("Books are temporarily unavailable.");
  return createClient<Database>(origin, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

async function signBookPath(path: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage.from("book-files").createSignedUrl(path, 300);
  if (error || !data) throw new Error("The book file is temporarily unavailable.");
  const url = new URL(data.signedUrl);
  const browserOrigin = process.env["VITE_SUPABASE_URL"];
  return browserOrigin ? `${browserOrigin}${url.pathname}${url.search}` : data.signedUrl;
}

export const listPublicBooks = createServerFn({ method: "GET" }).handler(async (): Promise<PublicBook[]> => {
  const { data, error } = await publicClient().from("books").select("id,title,description,price_amount,currency,cover_path").eq("published", true).order("created_at", { ascending: false });
  if (error) throw new Error("Could not load books.");
  return Promise.all((data ?? []).map(async ({ cover_path, ...book }) => ({ ...book, cover_url: cover_path ? await signBookPath(cover_path) : "" })));
});

export const readFirstChapter = createServerFn({ method: "POST" })
  .inputValidator(input => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: book, error } = await publicClient().from("books").select("first_chapter_path").eq("id", data.id).eq("published", true).maybeSingle();
    if (error || !book?.first_chapter_path) throw new Error("This preview is not available.");
    return signBookPath(book.first_chapter_path);
  });

export const readFullBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const [{ data: role }, { data: purchases, error: purchaseError }] = await Promise.all([
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle(),
      context.supabase.from("book_purchases").select("status,environment").eq("book_id", data.id).eq("user_id", context.userId).eq("environment", "live").eq("status", "completed").limit(1),
    ]);
    if (purchaseError || !canReadFullBook(role?.role === "admin", purchases?.[0])) throw new Error("Purchase required to unlock this e-book.");
    const { data: book, error } = await context.supabase.from("books").select("full_book_path").eq("id", data.id).maybeSingle();
    if (error || !book?.full_book_path) throw new Error("This e-book is not available.");
    return signBookPath(book.full_book_path);
  });

export const saveBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => bookSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: role, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (roleError || !role) throw new Error("Administrator access required.");
    const { error } = await context.supabase.from("books").upsert(data);
    if (error) throw new Error(error.message);
    return { success: true };
  });