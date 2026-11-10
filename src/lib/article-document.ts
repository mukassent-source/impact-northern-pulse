export const ARTICLE_DOCUMENT_PREFIX = "article-document:v1:";
export type ArticleNode = { type: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: ArticleNode[] };
export function articleDocument(body: string): ArticleNode {
  if (body.startsWith(ARTICLE_DOCUMENT_PREFIX)) {
    try {
      const doc = JSON.parse(body.slice(ARTICLE_DOCUMENT_PREFIX.length));
      if (doc?.type === "doc" && Array.isArray(doc.content)) return doc;
    } catch { /* Preserve malformed legacy content as plain text. */ }
  }
  return { type: "doc", content: body.split(/\n/).map(text => ({ type: "paragraph", content: text ? [{ type: "text", text }] : [] })) };
}
export function articleText(body: string): string {
  function text(node: ArticleNode): string { return node.text ?? (node.content ?? []).map(text).join(node.type === "paragraph" ? "" : " "); }
  return text(articleDocument(body)).trim();
}
export function safeArticleLink(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  try { const url = new URL(value); if (["https:", "http:", "mailto:"].includes(url.protocol)) return url.href; } catch { /* Reject unsafe or incomplete links. */ }
  return undefined;
}