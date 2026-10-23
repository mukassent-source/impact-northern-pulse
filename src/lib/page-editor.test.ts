import { describe, expect, it } from "vitest";
import { editablePages, pageSections, pageRecord } from "./page-editor";
import type { Entry } from "./content";

describe("Page editing", () => {
  for (const path of ["/about", "/leadership", "/media-development", "/youth-empowerment", "/projects", "/impact", "/insights", "/gallery", "/contact"]) {
    it(`supports uploads and updates on ${path}`, () => {
      expect(editablePages.some(page => page.path === path)).toBe(true);
      expect(pageSections.some(section => section.key === path)).toBe(true);
    });
  }
  it("does not display a draft page override", () => {
    const entry = { id: "draft", kind: "page", category: "/contact#email", published: false, created_at: "2026-01-01" } as Entry;
    expect(pageRecord([entry], "/contact#email", true)).toBeUndefined();
    expect(pageRecord([entry], "/contact#email")?.id).toBe("draft");
  });
});