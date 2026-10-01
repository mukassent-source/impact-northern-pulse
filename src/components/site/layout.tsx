import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
    <div className="section-wrap flex h-[74px] items-center justify-between gap-5">
      <Link to="/" className="shrink-0 text-[17px] font-extrabold uppercase leading-none text-foreground md:text-xl">SAMUEL <span className="text-sage">ATO</span> AFFUL<span className="text-gold">.</span></Link>
      <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">{navItems.map(item => <Link key={item.label} to={item.to} activeProps={{ className: "text-sage" }} className="text-[11px] font-semibold text-foreground/75 transition-colors hover:text-sage">{item.label}</Link>)}</nav>
      <div className="flex items-center gap-3"><Button asChild size="sm" className="hidden h-10 rounded-sm px-5 text-xs font-bold lg:inline-flex"><Link to="/contact">Let's Collaborate <ArrowUpRight /></Link></Button><Button size="icon" variant="ghost" className="xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button></div>
    </div>
    {open && <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full max-h-[calc(100dvh-74px)] overflow-auto border-b border-border bg-background p-5 shadow-xl xl:hidden"><div className="grid grid-cols-2 gap-1">{navItems.map(item => <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="border-b border-border px-2 py-4 text-sm font-semibold">{item.label}</Link>)}</div><Button asChild className="mt-5 w-full rounded-sm"><Link to="/contact" onClick={() => setOpen(false)}>Let's Collaborate <ArrowRight/></Link></Button></nav>}
  </header>;
}
export function SiteFooter() {
  return <footer className="bg-dark py-10 text-dark-foreground"><div className="section-wrap flex flex-col items-center justify-between gap-4 md:flex-row"><p className="text-xs text-dark-foreground/60">© 2026 Samuel Ato Afful. All Rights Reserved.</p><Link to="/admin" className="text-xs text-dark-foreground/60 underline hover:text-gold">Owner sign in</Link></div></footer>;
}
export function PageIntro({ label, title, description }: {label:string;title:string;description:string}) { return <section className="bg-dark py-20 text-dark-foreground md:py-28"><div className="section-wrap"><p className="eyebrow text-gold">{label}</p><h2 className="editorial-heading mt-5 max-w-4xl text-5xl md:text-7xl">{title}</h2><p className="mt-7 max-w-2xl text-base leading-8 text-dark-foreground/70 md:text-lg">{description}</p></div></section>; }
export function SectionTitle({label,title,description}:{label:string;title:string;description?:string}) { return <div className="mb-10"><p className="eyebrow text-sage">{label}</p><h2 className="editorial-heading mt-4 max-w-3xl text-4xl md:text-5xl">{title}</h2>{description && <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>}</div>; }
export function Placeholder({children}:{children:string}) {return <span className="text-muted-foreground italic">[{children}]</span>}
