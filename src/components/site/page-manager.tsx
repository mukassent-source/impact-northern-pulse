import { ArrowUpRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { editablePages, pageRecord } from "@/lib/page-editor";
import type { Entry } from "@/lib/content";
import type { AdminSection } from "./admin-dashboard";

export function PageManager({ entries, onEdit, onManage }: { entries: Entry[]; onEdit: (key: string) => void; onManage: (kind: AdminSection) => void }) {
  return <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{editablePages.map(page => <article key={page.path} className="rounded-md border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{page.label}</h2><Button asChild variant="ghost" size="icon"><a href={page.path} target="_blank" rel="noopener noreferrer" aria-label={`View ${page.label}`} title={`View ${page.label}`}><ArrowUpRight/></a></Button></div>
    <div className="mt-4 divide-y divide-border">{[["", "Page header"], ...page.sections].map(([key, label]) => { const category = key ? `${page.path}#${key}` : page.path; const record = pageRecord(entries, category); return <div key={category} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{record ? record.published ? "Published" : "Draft" : "Original content"}</p></div><Button variant="outline" size="icon" onClick={() => onEdit(category)} aria-label={`Edit ${page.label} ${label}`} title={`Edit ${label}`}><Pencil size={16}/></Button></div>; })}</div>
    {!!page.kinds.length && <div className="mt-4 flex flex-wrap gap-2">{page.kinds.map(kind => <Button key={kind} size="sm" variant="outline" onClick={() => onManage(kind as AdminSection)}>{kind === "article" ? "Articles" : kind === "quote" ? "Quote cuts" : kind === "social" ? "Social links" : `${kind[0]?.toUpperCase()}${kind.slice(1)}s`}<ArrowUpRight size={14}/></Button>)}</div>}
  </article>)}</div>;
}