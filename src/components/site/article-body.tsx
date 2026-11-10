import { Fragment, type ReactNode } from "react";
import { articleDocument, safeArticleLink, type ArticleNode } from "@/lib/article-document";

function renderNode(node: ArticleNode, key: number): ReactNode {
  const children = node.content?.map(renderNode);
  if (node.type === "text") {
    let text: ReactNode = node.text;
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = <strong>{text}</strong>;
      if (mark.type === "italic") text = <em>{text}</em>;
      if (mark.type === "underline") text = <u>{text}</u>;
      if (mark.type === "strike") text = <s>{text}</s>;
      if (mark.type === "code") text = <code>{text}</code>;
      if (mark.type === "link") { const href = safeArticleLink(mark.attrs?.href); if (href) text = <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>; }
    }
    return <Fragment key={key}>{text}</Fragment>;
  }
  const align = node.attrs?.textAlign;
  const className = align === "center" ? "text-center" : align === "right" ? "text-right" : align === "justify" ? "text-justify" : "text-left";
  switch (node.type) {
    case "paragraph": return <p key={key} className={className}>{children || <br/>}</p>;
    case "heading": return node.attrs?.level === 3 ? <h4 key={key} className={className}>{children}</h4> : <h3 key={key} className={className}>{children}</h3>;
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "hardBreak": return <br key={key}/>;
    case "horizontalRule": return <hr key={key}/>;
    case "codeBlock": return <pre key={key}><code>{children}</code></pre>;
    default: return <Fragment key={key}>{children}</Fragment>;
  }
}
export function ArticleBody({ body, id, collapsed }: { body: string; id: string; collapsed: boolean }) {
  return <div id={id} className={`article-prose mt-4 text-base leading-8 text-muted-foreground ${collapsed ? "max-h-32 overflow-hidden" : ""}`}>{articleDocument(body).content?.map(renderNode)}</div>;
}