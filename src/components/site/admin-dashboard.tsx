import { ArrowUpRight, CalendarDays, FolderOpen, Handshake, Trophy, LayoutDashboard, UserRound, Newspaper, Images, MessageSquare, Quote, FileText, Globe, ChartNoAxesCombined, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Entry } from "@/lib/content";
import { partnershipApplications, upcomingEvents, type AdminMessage } from "@/lib/admin-dashboard";

export const adminSections = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "application", label: "Applications", icon: Handshake },
  { key: "project", label: "Projects", icon: FolderOpen },
  { key: "achievement", label: "Achievements", icon: Trophy },
  { key: "event", label: "Events", icon: CalendarDays },
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "article", label: "Insights", icon: Newspaper },
  { key: "gallery", label: "Gallery", icon: Images },
  { key: "quote", label: "Quote cuts", icon: Quote },
  { key: "testimonial", label: "Testimonials", icon: MessageSquare },
  { key: "impact", label: "Impact", icon: ChartNoAxesCombined },
  { key: "partner", label: "Partners", icon: Users },
  { key: "page", label: "Page text", icon: FileText },
  { key: "social", label: "Social links", icon: Globe },
  { key: "message", label: "Messages", icon: MessageSquare },
] as const;
export type AdminSection = typeof adminSections[number]["key"];

export function AdminNavigation({ section, onSelect }: { section: AdminSection; onSelect: (key: AdminSection) => void }) {
  return <aside className="border-b border-border bg-card lg:border-b-0 lg:border-r">
    <div className="p-5"><p className="eyebrow text-muted-foreground">Workspace</p><p className="mt-2 font-semibold">Samuel Ato Afful</p></div>
    <label className="block px-5 pb-5 lg:hidden"><span className="sr-only">Admin section</span><select aria-label="Admin section" value={section} onChange={event => onSelect(event.target.value as AdminSection)} className="h-11 w-full rounded-md border border-input bg-background px-3">{adminSections.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
    <nav aria-label="Admin navigation" className="hidden space-y-1 px-3 pb-6 lg:block">{adminSections.map(({ key, label, icon: Icon }) => <Button key={key} variant={section === key ? "default" : "ghost"} className="w-full justify-start rounded-md" aria-current={section === key ? "page" : undefined} onClick={() => onSelect(key)}><Icon size={17}/>{label}</Button>)}</nav>
  </aside>;
}

const dateLabel = (value: string) => new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Accra" });
export function AdminDashboard({ entries, messages, onSelect, onEdit }: { entries: Entry[]; messages: AdminMessage[]; onSelect: (key: AdminSection) => void; onEdit: (entry: Entry) => void }) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const applications = partnershipApplications(messages);
  const projects = entries.filter(entry => entry.kind === "project");
  const achievements = entries.filter(entry => entry.kind === "achievement");
  const events = upcomingEvents(entries, today);
  const stats = [
    { key: "application", title: "Applications", count: applications.length, icon: Handshake, detail: "Partnership enquiries" },
    { key: "project", title: "Projects", count: projects.length, icon: FolderOpen, detail: `${projects.filter(item => item.published).length} published` },
    { key: "achievement", title: "Achievements", count: achievements.length, icon: Trophy, detail: `${achievements.filter(item => item.published).length} published` },
    { key: "event", title: "Upcoming events", count: events.length, icon: CalendarDays, detail: "Today and beyond" },
  ] as const;
  return <div className="mt-8 space-y-10">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ key, title, count, icon: Icon, detail }) => <article key={key} className="rounded-md border border-border bg-card p-5"><div className="flex items-center justify-between gap-2"><h2 className="text-sm font-semibold text-muted-foreground">{title}</h2><Icon className="text-sage" size={20}/></div><p className="mt-5 text-4xl font-semibold tabular-nums">{count}</p><div className="mt-4 flex items-center justify-between gap-2"><p className="text-xs text-muted-foreground">{detail}</p><Button size="icon" variant="ghost" aria-label={`View ${title.toLowerCase()}`} onClick={() => onSelect(key)}><ArrowUpRight size={16}/></Button></div></article>)}</div>
    <section><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Recent applications</h2><Button variant="link" onClick={() => onSelect("application")}>View all <ArrowUpRight/></Button></div>{applications.length ? <div className="divide-y divide-border border-y border-border">{applications.slice(0, 4).map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="font-semibold break-words">{item.organization || item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.name} · {dateLabel(item.created_at)}</p></div><Button variant="outline" size="sm" onClick={() => onSelect("application")}>Review <ArrowUpRight/></Button></div>)}</div> : <Empty title="No applications yet"/>}</section>
    <div className="grid gap-10 xl:grid-cols-2">{[{ title: "Projects", key: "project" as const, records: projects }, { title: "Achievements", key: "achievement" as const, records: achievements }].map(({ title, key, records }) => <section key={key}><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{title}</h2><Button variant="link" onClick={() => onSelect(key)}>Manage <ArrowUpRight/></Button></div>{records.length ? <div className="divide-y divide-border border-y border-border">{records.slice(0, 4).map(item => <div key={item.id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="break-words font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.category || title} · {item.published ? "Published" : "Draft"}</p></div><Button variant="ghost" size="icon" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}><ArrowUpRight/></Button></div>)}</div> : <Empty title={`No ${title.toLowerCase()} yet`} action={() => onSelect(key)}/>}</section>)}</div>
    <section><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Upcoming events</h2><Button variant="link" onClick={() => onSelect("event")}>Manage events <ArrowUpRight/></Button></div>{events.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{events.slice(0, 6).map(item => <article key={item.id} className="rounded-md border border-border bg-card p-5"><p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><CalendarDays size={16}/>{dateLabel(item.occurred_on ?? today)}</p><h3 className="mt-4 break-words text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{item.location || "Location not added"} · {item.published ? "Published" : "Draft"}</p><Button variant="link" className="mt-3 px-0" onClick={() => onEdit(item)}>Edit event <ArrowUpRight/></Button></article>)}</div> : <Empty title="No upcoming events" action={() => onSelect("event")}/>}</section>
  </div>;
}
function Empty({ title, action }: { title: string; action?: () => void }) {
  return <div className="border-y border-dashed border-border py-8"><p className="text-sm text-muted-foreground">{title}</p>{action && <Button variant="link" className="mt-2 px-0" onClick={action}>Add an entry <ArrowUpRight/></Button>}</div>;
}