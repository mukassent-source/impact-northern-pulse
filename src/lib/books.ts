import { z } from "zod";

export const BOOK_FILE_LIMIT = 100_000_000;
export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(180),
  description: z.string().max(5000),
  price_amount: z.number().int().positive(),
  currency: z.enum(["USD", "EUR", "GBP"]),
  cover_path: z.string().max(300),
  first_chapter_path: z.string().max(300),
  full_book_path: z.string().max(300),
  published: z.boolean(),
}).superRefine((book, ctx) => {
  for (const field of ["cover_path", "first_chapter_path", "full_book_path"] as const) {
    const path = book[field];
    if (path && (!path.startsWith(`${book.id}/`) || path.includes("..") || path.includes(":"))) {
      ctx.addIssue({ code: "custom", path: [field], message: "Invalid book file." });
    }
  }
  if (book.published && (!book.first_chapter_path || !book.full_book_path || book.first_chapter_path === book.full_book_path)) {
    ctx.addIssue({ code: "custom", message: "Upload a separate first chapter and full e-book before publishing." });
  }
});

export function canReadFullBook(isAdmin: boolean, purchase?: { status: string; environment: string } | null) {
  return isAdmin || (purchase?.status === "completed" && purchase.environment === "live");
}

export function bookPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount / 100);
}