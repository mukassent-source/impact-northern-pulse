import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleBody } from "@/components/site/article-body";
import { ARTICLE_BODY_LIMIT, ARTICLE_DOCUMENT_PREFIX, articleDocument, articleText, isOverBodyLimit, safeArticleLink } from "./article-document";

describe("formatted article content", () => {
  it("keeps existing plain text editable", () => {
    expect(articleDocument("First paragraph\nSecond paragraph").content).toHaveLength(2);
    expect(articleText("First paragraph\nSecond paragraph")).toBe("First paragraph Second paragraph");
  });
  it("preserves formatting through stored document round trips", () => {
    const document = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Published article", marks: [{ type: "bold" }] }] }] };
    const body = ARTICLE_DOCUMENT_PREFIX + JSON.stringify(document);
    expect(articleDocument(body)).toEqual(document);
    expect(articleText(body)).toBe("Published article");
    expect(renderToStaticMarkup(<ArticleBody id="test" body={body} collapsed={false}/>)).toContain("<strong>Published article</strong>");
  });
  it("does not execute pasted HTML or unsafe stored links", () => {
    expect(safeArticleLink("javascript:alert(1)")).toBeUndefined();
    const body = ARTICLE_DOCUMENT_PREFIX + JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "<script>alert(1)</script>", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] });
    const html = renderToStaticMarkup(<ArticleBody id="test" body={body} collapsed={false}/>);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("&lt;script&gt;");
  });
});