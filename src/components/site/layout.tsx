import { useRouterState } from "@tanstack/react-router";
import { Media, usePageText } from "./media";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/site-data";
import brandLogo from "@/assets/samuel-ato-afful-logo.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-dark-foreground/10 bg-dark/95 text-dark-foreground backdrop-blur-xl">
    <div className="section-wrap flex h-[86px] items-center justify-between gap-5">
      <Link to="/" aria-label="Samuel Ato Afful home" className="flex h-[66px] w-[146px] shrink-0 items-center overflow-hidden md:w-[164px]"><img src={brandLogo.url} alt="Samuel Ato Afful" width={1536} height={768} className="h-auto w-full object-contain"/></Link>
      <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">{navItems.map(item => <Link key={item.label} to={item.to} activeProps={{ className: "text-gold" }} className="text-[11px] font-semibold text-dark-foreground/70 transition-colors hover:text-gold">{item.label}</Link>)}</nav>
      <div className="flex items-center gap-3"><Button asChild size="sm" className="hidden h-10 rounded-sm px-5 text-xs font-bold focus-visible:ring-offset-dark lg:inline-flex"><Link to="/contact">Let's Collaborate <ArrowUpRight /></Link></Button><Button size="icon" variant="ghost" className="text-dark-foreground hover:bg-dark-foreground/10 hover:text-gold xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button></div>
    </div>
    {open && <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full max-h-[calc(100dvh-86px)] overflow-auto border-b border-dark-foreground/10 bg-dark p-5 shadow-xl xl:hidden"><div className="grid grid-cols-2 gap-px bg-dark-foreground/10">{navItems.map(item => <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="bg-dark px-3 py-4 text-sm font-semibold text-dark-foreground/80 transition-colors hover:text-gold">{item.label}</Link>)}</div><Button asChild className="mt-5 w-full rounded-sm focus-visible:ring-offset-dark"><Link to="/contact" onClick={() => setOpen(false)}>Let's Collaborate <ArrowRight/></Link></Button></nav>}
  </header>;
}
export function SiteFooter() {
  return <footer className="bg-dark py-10 text-dark-foreground"><div className="section-wrap flex flex-col items-center justify-between gap-4 md:flex-row"><p className="text-xs text-dark-foreground/60">© 2026 Samuel Ato Afful. All Rights Reserved.</p><Button asChild size="sm" className="h-9 rounded-sm px-5 text-[13px] font-bold text-dark hover:bg-gold/90 focus-visible:ring-offset-dark"><Link to="/admin"><ArrowRight className="h-3.5 w-3.5" /> Owner sign in</Link></Button></div></footer>;
}
export function PageIntro({ label, title, description }: {label:string;title:string;description:string}) { const path=useRouterState({select:s=>s.location.pathname});const o=usePageText(path);if(o){title=o.title||title;description=o.body||description;label=o.location||label} return <section className="relative overflow-hidden border-b border-dark-foreground/10 bg-dark py-20 text-dark-foreground md:py-28"><div className="section-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end"><div><p className="eyebrow text-gold">{label}</p><h1 className="editorial-heading mt-5 max-w-4xl text-5xl md:text-7xl">{title}</h1></div><p className="border-l border-gold/60 pl-6 text-base leading-8 text-dark-foreground/65 md:text-lg">{description}</p></div>{o?.image_url&&<div className="section-wrap mt-10"><Media entry={o} className="max-h-[500px] w-full object-contain"/></div>}</section>; }
export function SectionTitle({label,title,description}:{label:string;title:string;description?:string}) { return <div className="mb-10"><p className="eyebrow text-sage">{label}</p><h2 className="editorial-heading mt-4 max-w-3xl text-4xl md:text-5xl">{title}</h2>{description && <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>}</div>; }
export function Placeholder({children}:{children:string}) {return <span className="text-muted-foreground italic">[{children}]</span>}
