import { JournalComments } from "./journal-comments";
import { Media, mediaType } from "./media";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { getEntries, type Entry } from "@/lib/content";
import { projectExamples } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import mediaImage from "@/assets/ghana-media.jpg";
import youthImage from "@/assets/ghana-youth-workshop.jpg";

const categories = ["All", "Media", "Youth", "Community", "Digital", "Leadership", "Development"];
export function ProjectGrid({limit}:{limit?:number}) {
  const [category,setCategory] = useState("All");
  const {data=[]} = useQuery({queryKey:["content","project"],queryFn:()=>getEntries("project")});
  const records = data.length ? data.map(item => ({...item, placeholder:false})) : projectExamples.map((item, index) => ({...item,id:String(index),body:item.description,image_url:"",placeholder:true,location:"",occurred_on:null,metric:""}));
  const filtered = records.filter(item => category === "All" || item.category === category).slice(0,limit);
  return <><div className="mb-8 flex flex-wrap gap-2">{categories.map(cat => <Button key={cat} size="sm" variant={category===cat?"default":"outline"} onClick={()=>setCategory(cat)} className="rounded-sm">{cat}</Button>)}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filtered.map((item,index) => <article key={item.id} className="group overflow-hidden border border-border bg-card"><div className="aspect-[4/3] overflow-hidden bg-secondary">{item.image_url&&!item.placeholder&&mediaType((item as Entry).image_path)!=="image"?<Media entry={item as Entry} className="h-full w-full object-contain"/>:<img src={item.image_url || (index%2 ? youthImage : mediaImage)} alt={item.placeholder ? "Illustrative editorial image, not documentation of this project" : item.title} width={700} height={500} loading="lazy" className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${item.placeholder?"object-cover":"object-contain"}`}/>}</div><div className="p-6"><p className="eyebrow text-sage">{item.category} {item.placeholder && "· Example placeholder"}</p><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{item.body}</p><p className="mt-4 text-xs text-muted-foreground">{item.occurred_on?.slice(0,4) || "[Year]"} · {item.location || "[Location]"}</p><p className="mt-2 text-xs text-muted-foreground">Impact: {item.metric || "[Add verified impact]"}</p><Button asChild variant="link" className="mt-3 h-auto px-0 text-foreground"><Link to="/projects/$id" params={{id:item.id}}>View Project <ArrowUpRight/></Link></Button></div></article>)}</div></>;
}
export function Entries({kind}:{kind:"achievement"|"article"|"event"|"gallery"|"testimonial"|"partner"|"impact"|"perspective"}) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(() => new Set());
  function toggleEvent(id: string) {
    setExpandedEvents(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const {data=[],isLoading} = useQuery({queryKey:["content",kind],queryFn:()=>getEntries(kind)});
  if(isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if(!data.length) return <div className="border-y border-border py-12 text-muted-foreground"><p className="text-lg">Verified {kind === "article" ? "journal posts" : kind === "gallery" ? "photographs" : kind === "perspective" ? "perspective media" : `${kind}s`} will appear here.</p><p className="mt-2 text-sm">[Add verified {kind === "perspective" ? "perspective media" : kind} details]</p></div>;
  return <div className={kind==="gallery"?"columns-1 gap-5 sm:columns-2 lg:columns-3":kind==="event"?"grid gap-5":"grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>{data.map((item:Entry)=><article key={item.id} className="mb-5 break-inside-avoid overflow-hidden border border-border bg-card"><Media entry={item}/>{!!item.extra_media?.length&&<div className="grid grid-cols-3 gap-1 p-1">{item.extra_media.map(m=><Media key={m.path} entry={{...item,image_url:m.url,image_path:m.path}} className="aspect-square w-full bg-secondary object-cover"/>)}</div>}<div className="p-6"><p className="eyebrow text-sage">{item.category || (kind === "perspective" ? "Perspective" : kind)} {item.occurred_on && `· ${item.occurred_on}`}</p><h3 className="mt-3 text-xl font-bold">{item.title}</h3><p id={`entry-body-${item.id}`} className={`mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground ${kind==="event"&&!expandedEvents.has(item.id)?"line-clamp-4":""}`}>{item.body}</p>{kind==="event"&&item.body&&<Button size="sm" className="mt-3 h-9 rounded-sm px-5 text-[13px] font-bold text-dark hover:bg-gold/90" aria-expanded={expandedEvents.has(item.id)} aria-controls={`entry-body-${item.id}`} onClick={()=>toggleEvent(item.id)}><ArrowUpRight className="h-3.5 w-3.5"/>{expandedEvents.has(item.id)?"Show less":"Read more"}</Button>}{kind==="article" && <p className="mt-5 text-xs text-muted-foreground">Samuel Ato Afful · {Math.max(1,Math.ceil(item.body.split(/\s+/).length/200))} min read</p>}{kind==="article"&&item.published&&<JournalComments entryId={item.id}/>}</div></article>)}</div>;
}
