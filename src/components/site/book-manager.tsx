import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { saveBook } from "@/lib/books.functions";
import { BOOK_FILE_LIMIT, bookPrice } from "@/lib/books";

type Book = Tables<"books">;
export function BookManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Book> | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const { data: books = [], isPending, error } = useQuery({ queryKey: ["admin", "books"], queryFn: async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const id = editing.id ?? crypto.randomUUID();
    const uploaded: string[] = [];
    setBusy(true); setNotice("");
    try {
      const paths = { cover_path: "", first_chapter_path: "", full_book_path: "" };
      for (const field of ["cover_path", "first_chapter_path", "full_book_path"] as const) {
        const file = form.get(field);
        paths[field] = editing[field] ?? "";
        if (!(file instanceof File) || !file.size) continue;
        if (file.size > BOOK_FILE_LIMIT || (field === "cover_path" ? !["image/jpeg", "image/png", "image/webp"].includes(file.type) : !file.name.toLowerCase().endsWith(".pdf"))) throw new Error("Use a JPG, PNG or WebP cover and PDF chapter/book files, each under 100 MB.");
        const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
        const { error } = await supabase.storage.from("book-files").upload(path, file);
        if (error) throw error;
        paths[field] = path; uploaded.push(path);
      }
      await saveBook({ data: { id, title: String(form.get("title")), description: String(form.get("description")), price_amount: Math.round(Number(form.get("price")) * 100), currency: String(form.get("currency")) as "USD" | "EUR" | "GBP", cover_path: paths.cover_path ?? "", first_chapter_path: paths.first_chapter_path ?? "", full_book_path: paths.full_book_path ?? "", published: (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "publish" } });
      setEditing(null); setNotice("Book saved.");
      await qc.invalidateQueries({ queryKey: ["admin", "books"] });
      await qc.invalidateQueries({ queryKey: ["books"] });
    } catch (error) {
      if (uploaded.length) await supabase.storage.from("book-files").remove(uploaded);
      setNotice(error instanceof Error ? error.message : "Could not save book.");
    } finally { setBusy(false); }
  }
  async function remove(book: Book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    const { error } = await supabase.from("books").delete().eq("id", book.id);
    if (error) { setNotice(error.message); return; }
    await supabase.storage.from("book-files").remove([book.cover_path, book.first_chapter_path, book.full_book_path].filter(Boolean));
    await qc.invalidateQueries({ queryKey: ["admin", "books"] });
    await qc.invalidateQueries({ queryKey: ["books"] });
  }
  return <div className="mt-8">
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{books.length} books</p><Button onClick={() => { setEditing({}); setNotice(""); }}><Plus/>Add book</Button></div>
    <p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>
    {isPending ? <p>Loading books…</p> : error ? <p role="alert">Could not load books.</p> : <div className="mt-6 space-y-3">{books.map(book => <article key={book.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-5"><div><p className="text-xs text-muted-foreground">{book.published ? "Published" : "Draft"} · {bookPrice(book.price_amount, book.currency)}</p><h2 className="mt-2 break-words font-semibold">{book.title}</h2></div><div className="flex gap-2"><Button variant="outline" size="icon" aria-label={`Edit ${book.title}`} onClick={() => { setEditing(book); setNotice(""); }}><Pencil/></Button><Button variant="outline" size="icon" aria-label={`Delete ${book.title}`} onClick={() => remove(book)}><Trash2/></Button></div></article>)}</div>}
    {editing && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/70 p-4"><div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-md bg-card p-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">{editing.id ? "Edit book" : "Add book"}</h2><Button variant="ghost" size="icon" disabled={busy} aria-label="Close book editor" onClick={() => setEditing(null)}><X/></Button></div>
      <form onSubmit={save} className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold sm:col-span-2">Book title<input name="title" defaultValue={editing.title} required maxLength={180} className="mt-2 h-11 w-full border border-input bg-background px-3"/></label>
        <label className="text-sm font-semibold sm:col-span-2">Description<textarea name="description" defaultValue={editing.description} maxLength={5000} rows={4} className="mt-2 w-full border border-input bg-background p-3"/></label>
        <label className="text-sm font-semibold">Price<input name="price" type="number" min="0.70" step="0.01" defaultValue={editing.price_amount ? editing.price_amount / 100 : undefined} required className="mt-2 h-11 w-full border border-input bg-background px-3"/></label>
        <label className="text-sm font-semibold">Currency<select name="currency" defaultValue={editing.currency ?? "USD"} className="mt-2 h-11 w-full border border-input bg-background px-3"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></select></label>
        {([ ["Cover image", "cover_path"], ["Free first chapter (PDF)", "first_chapter_path"], ["Full e-book — locked (PDF)", "full_book_path"] ] as const).map(([label, field]) => <label key={field} className="min-w-0 text-sm font-semibold sm:col-span-2">{label}<input name={field} type="file" accept={field === "cover_path" ? "image/jpeg,image/png,image/webp" : ".pdf,application/pdf"} className="mt-2 block w-full text-xs"/>{editing[field] && <span className="mt-2 block break-all text-xs font-normal text-muted-foreground">Current file: {editing[field]?.split("/").pop()}</span>}</label>)}
        <div className="flex flex-wrap justify-end gap-2 sm:col-span-2"><Button type="submit" value="draft" variant="outline" disabled={busy}>Save draft</Button><Button type="submit" value="publish" disabled={busy}>{busy ? "Saving…" : "Publish book"}</Button></div>
      </form><p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>
    </div></div>}
  </div>;
}