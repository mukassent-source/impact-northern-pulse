import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Link, Unlink, RemoveFormatting } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARTICLE_DOCUMENT_PREFIX, articleDocument, articleText, safeArticleLink } from "@/lib/article-document";

export function ArticleEditor({ initialBody }: { initialBody: string }) {
  const [body, setBody] = useState(initialBody);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), TextAlign.configure({ types: ["heading", "paragraph"] })],
    immediatelyRender: false,
    content: articleDocument(initialBody),
    editorProps: { attributes: { role: "textbox", "aria-label": "Article content", "aria-multiline": "true", class: "article-prose min-h-72 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" } },
    onUpdate: ({ editor }) => setBody(ARTICLE_DOCUMENT_PREFIX + JSON.stringify(editor.getJSON())),
  });
  useEditorState({ editor, selector: ({ editor }) => editor?.getJSON() });
  const tools = [
    { label: "Bold", icon: Bold, active: editor?.isActive("bold"), run: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: editor?.isActive("italic"), run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Underline", icon: Underline, active: editor?.isActive("underline"), run: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Strikethrough", icon: Strikethrough, active: editor?.isActive("strike"), run: () => editor?.chain().focus().toggleStrike().run() },
    { label: "Bulleted list", icon: List, active: editor?.isActive("bulletList"), run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: editor?.isActive("orderedList"), run: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Quotation", icon: Quote, active: editor?.isActive("blockquote"), run: () => editor?.chain().focus().toggleBlockquote().run() },
    ...[{ label: "Align left", icon: AlignLeft, align: "left" }, { label: "Align center", icon: AlignCenter, align: "center" }, { label: "Align right", icon: AlignRight, align: "right" }].map(tool => ({ ...tool, active: editor?.isActive({ textAlign: tool.align }), run: () => editor?.chain().focus().setTextAlign(tool.align).run() })),
    { label: "Remove formatting", icon: RemoveFormatting, run: () => editor?.chain().focus().unsetAllMarks().clearNodes().run() },
    { label: "Undo", icon: Undo2, disabled: !editor?.can().undo(), run: () => editor?.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, disabled: !editor?.can().redo(), run: () => editor?.chain().focus().redo().run() },
  ];
  const words = articleText(body).split(/\s+/).filter(Boolean).length;
  return <div className="sm:col-span-2 min-w-0"><p className="mb-2 text-sm font-semibold">Article content</p><div className="overflow-hidden rounded-md border border-input bg-background">
    <div role="toolbar" aria-label="Article formatting" className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary p-2">
      <select aria-label="Paragraph style" className="h-9 max-w-full rounded-sm border border-input bg-background px-2 text-sm" value={editor?.isActive("heading", { level: 2 }) ? "2" : editor?.isActive("heading", { level: 3 }) ? "3" : "paragraph"} onChange={event => event.target.value === "paragraph" ? editor?.chain().focus().setParagraph().run() : editor?.chain().focus().setHeading({ level: event.target.value === "2" ? 2 : 3 }).run()}><option value="paragraph">Normal text</option><option value="2">Heading 1</option><option value="3">Heading 2</option></select>
      {tools.map(({ label, icon: Icon, active, disabled, run }) => <Button key={label} type="button" size="icon" variant={active ? "default" : "ghost"} className="h-9 w-9 shrink-0" title={label} aria-label={label} aria-pressed={active} disabled={!editor || disabled} onClick={run}><Icon size={16}/></Button>)}
      <Button type="button" size="icon" variant={editor?.isActive("link") ? "default" : "ghost"} title="Insert link" aria-label="Insert link" onClick={() => { setUrl(String(editor?.getAttributes("link").href ?? "")); setLinkOpen(!linkOpen); }}><Link size={16}/></Button>
      <Button type="button" size="icon" variant="ghost" title="Remove link" aria-label="Remove link" disabled={!editor?.isActive("link")} onClick={() => editor?.chain().focus().extendMarkRange("link").unsetLink().run()}><Unlink size={16}/></Button>
    </div>
    {linkOpen && <div className="flex flex-wrap gap-2 border-b border-border p-2"><input aria-label="Link URL" type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://" className="h-9 min-w-0 flex-1 border border-input bg-background px-2 text-sm"/><Button type="button" size="sm" disabled={!safeArticleLink(url)} onClick={() => { const href = safeArticleLink(url); if (href) { editor?.chain().focus().extendMarkRange("link").setLink({ href }).run(); setLinkOpen(false); } }}>Apply link</Button></div>}
    <EditorContent editor={editor}/>
    <div className="flex flex-wrap justify-between gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground"><span>{words} words</span><span>{body.length.toLocaleString()} / 20,000</span></div>
  </div><input type="hidden" name="body" value={body}/>{body.length > 20000 && <p role="alert" className="mt-2 text-sm text-foreground">Article exceeds the saved content limit. Shorten it before saving.</p>}</div>;
}