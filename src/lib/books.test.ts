import { describe, it, expect } from "vitest";
import { bookSchema, canReadFullBook } from "./books";

describe("e-book publishing and access", () => {
  const id = "790cc609-47f4-4e36-8a8c-964c24520c55";
  const book = { id, title: "Test book", description: "", price_amount: 1000, currency: "USD", cover_path: "", first_chapter_path: `${id}/chapter.pdf`, full_book_path: `${id}/book.pdf`, published: true };
  it("requires a separate free first-chapter file before publication", () => {
    expect(bookSchema.safeParse(book).success).toBe(true);
    expect(bookSchema.safeParse({ ...book, first_chapter_path: "" }).success).toBe(false);
    expect(bookSchema.safeParse({ ...book, first_chapter_path: book.full_book_path }).success).toBe(false);
  });
  it("keeps the full e-book locked without a completed live purchase", () => {
    expect(canReadFullBook(false)).toBe(false);
    expect(canReadFullBook(false, { status: "refunded", environment: "live" })).toBe(false);
    expect(canReadFullBook(false, { status: "completed", environment: "sandbox" })).toBe(false);
    expect(canReadFullBook(false, { status: "completed", environment: "live" })).toBe(true);
    expect(canReadFullBook(true)).toBe(true);
  });
});