import { useState } from "react";
import { BookOpen, LockKeyhole } from "lucide-react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { listPublicBooks, readFirstChapter } from "@/lib/books.functions";
import { bookPrice } from "@/lib/books";

export const booksQuery = queryOptions({ queryKey: ["books", "public"], queryFn: () => listPublicBooks() });
export function BookLibrary() {
  const { data: books } = useSuspenseQuery(booksQuery);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  async function preview(id: string) {
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    setBusy(id); setNotice("");
    try {
      const url = await readFirstChapter({ data: { id } });
      if (tab) tab.location.href = url;
      else window.location.assign(url);
    } catch { tab?.close(); setNotice("Could not open this chapter. Please try again."); }
    finally { setBusy(""); }
  }
  if (!books.length) return <div className="flex items-start gap-5 border-y border-border py-10"><BookOpen className="h-8 w-8 shrink-0 text-sage"/><div><h2 className="text-xl font-semibold">No books published yet.</h2><p className="mt-2 text-sm text-muted-foreground">The collection is coming soon.</p></div></div>;
  return <><p role="status" className="mb-4 text-sm text-muted-foreground">{notice}</p><div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">{books.map(book => <article key={book.id} className="overflow-hidden rounded-sm border border-border bg-card">
    <div className="flex aspect-[3/4] items-center justify-center bg-secondary p-4">{book.cover_url ? <img src={book.cover_url} alt={`${book.title} cover`} className="h-full w-full object-contain"/> : <BookOpen className="h-16 w-16 text-sage"/>}</div>
    <div className="p-6"><p className="text-xs font-semibold text-sage">Samuel Ato Afful</p><h2 className="mt-3 break-words text-2xl font-semibold">{book.title}</h2><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">{book.description}</p><p className="mt-5 font-semibold">{bookPrice(book.price_amount, book.currency)}</p><Button className="mt-4 w-full" disabled={busy === book.id} onClick={() => preview(book.id)}><BookOpen/>{busy === book.id ? "Opening…" : "Read first chapter — free"}</Button><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole size={14}/>Remaining chapters locked · Sales coming soon</p></div>
  </article>)}</div></>;
}