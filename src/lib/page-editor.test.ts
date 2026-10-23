import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { editablePages, pageSections, pageRecord } from "./page-editor";
import type { Entry } from "./content";

describe("Page editing", () => {
  for (const path of ["/about", "/leadership", "/media-development", "/youth-empowerment", "/projects", "/impact", "/insights", "/gallery", "/contact"]) {
    it(`supports uploads and updates on ${path}`, () => {
      assert.equal(editablePages.some(page => page.path === path), true);
      assert.equal(pageSections.some(section => section.key === path), true);
    });
  }
  it("does not display a draft page override", () => {
    const entry = { id: "draft", kind: "page", category: "/contact#email", published: false, created_at: "2026-01-01" } as Entry;
    assert.equal(pageRecord([entry], "/contact#email", true), undefined);
    assert.equal(pageRecord([entry], "/contact#email")?.id, "draft");
  });
});