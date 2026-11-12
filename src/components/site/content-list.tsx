import { ArticleBody } from "./article-body";
import { articleText } from "@/lib/article-document";
import { JournalComments } from "./journal-comments";
import { Media, mediaType } from "./media";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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
  return <><div className="mb-8 flex flex-wrap gap-2">{categories.map(cat => <Button key={cat} size="sm" variant={category===cat?"default":"outline"} onClick={()=>setCategory(cat)} className="rounded-sm">{cat}</Button>)}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filtered.map((item,index) => <article key={item.id} className="group overflow-hidden border border-border bg-card"><div className="aspect-[4/3] overflow-hidden bg-secondary">{item.image_url&&!item.placeholder&&mediaType((item as Entry).image_path)!=="image"?<Media entry={item as Entry} className="h-full w-full object-contain"/>:<img src={item.image_url || (index%2 ? youthImage : mediaImage)} alt={item.placeholder ? "Illustrative editorial image, not documentation of this project" : item.title} width={700} height={500} loading="lazy" className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${item.placeholder?"object-cover":"object-contain"}`}/>}</div><div className="p-6"><p className="eyebrow text-sage">{item.category} {item.placeholder && "· Example placeholder"}</p><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{item.body}</p><p className="mt-4 text-xs text-muted-foreground">{item.occurred_on?.slice(0,4) || "[Year]"} · {item.location || "[Location]"}</p><Button asChild size="sm" className="mt-3 h-9 rounded-sm px-5 text-[13px] font-bold text-dark hover:bg-gold/90"><Link to="/projects/$id" params={{id:item.id}}>View Project <ArrowUpRight/></Link></Button></div></article>)}</div></>;
}
export function Entries({kind}:{kind:"achievement"|"article"|"event"|"gallery"|"testimonial"|"partner"|"impact"|"perspective"}) {
  const [expanded, setExpandedEvents] = useState<Set<string>>(() => new Set());
  function toggle(id: string) {
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
  if (kind === "gallery") return <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
    {data.map(item => <figure key={item.id} className="min-w-0">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm border border-border bg-secondary p-2">
        <Media entry={item} className="h-full w-full object-contain"/>
      </div>
      {!!item.extra_media?.length && <div className="mt-2 grid grid-cols-3 gap-2">{item.extra_media.map(media => <Media key={media.path} entry={{...item, image_url:media.url, image_path:media.path}} className="aspect-square w-full rounded-sm bg-secondary object-contain"/>)}</div>}
      <figcaption className="mt-4 border-l-2 border-primary pl-4">
        {(item.category || item.occurred_on) && <p className="text-xs font-semibold text-muted-foreground">{[item.category, item.occurred_on].filter(Boolean).join(" · ")}</p>}
        <h3 className="mt-1 break-words text-lg font-semibold leading-6">{item.title}</h3>
        {item.body && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{item.body}</p>}
      </figcaption>
    </figure>)}
  </div>;
  return <div className={kind==="event"?"grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3":kind==="perspective"||kind==="article"?"grid grid-cols-1 items-start gap-6":"grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>{data.map((item:Entry)=>kind==="event" ? <article key={item.id} className={`overflow-hidden border border-border bg-card ${expanded.has(item.id)?"md:col-span-2 lg:col-span-3":""}`}>
    <Media entry={item} className={`w-full bg-secondary object-contain ${expanded.has(item.id)?"max-h-96":"aspect-[4/3]"}`}/>
    <div className="p-6"><p className="eyebrow text-sage">{item.category || "Events"}{item.occurred_on && ` · ${item.occurred_on}`}</p>
    <h3 className="mt-3"><Button variant="ghost" className="h-auto w-full justify-between gap-3 rounded-none p-0 text-left text-card-foreground hover:bg-transparent hover:text-foreground" aria-expanded={expanded.has(item.id)} aria-controls={`event-content-${item.id}`} onClick={()=>toggle(item.id)}>
      <span className="min-w-0 whitespace-normal break-words text-xl font-bold">{item.title}</span>
      <ChevronDown className={`h-5 w-5 shrink-0 text-sage transition-transform motion-reduce:transition-none ${expanded.has(item.id)?"rotate-180":""}`}/>
    </Button></h3>
    {!expanded.has(item.id)&&<p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p>}
    <div id={`event-content-${item.id}`} hidden={!expanded.has(item.id)}>
      {expanded.has(item.id)&&<>{!!item.extra_media?.length&&<div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{item.extra_media.map(m=><Media key={m.path} entry={{...item,image_url:m.url,image_path:m.path}} className="aspect-square w-full bg-secondary object-contain"/>)}</div>}<p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p></>}
    </div>
    </div>
  </article> : kind==="perspective"||kind==="article" ? <article key={item.id} className="overflow-hidden border border-border bg-card">
    <Media entry={item} className="max-h-[560px] w-full bg-secondary object-contain"/>
    {!!item.extra_media?.length&&<div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">{item.extra_media.map(m=><Media key={m.path} entry={{...item,image_url:m.url,image_path:m.path}} className="aspect-square w-full bg-secondary object-contain"/>)}</div>}
    <div className="p-6 md:p-8"><p className="eyebrow text-sage">{item.category || (kind==="perspective" ? "Perspective" : "Journal")} {item.occurred_on && `· ${item.occurred_on}`}</p><h3 className="mt-3 text-2xl font-bold md:text-3xl">{item.title}</h3>{kind==="article"?<ArticleBody body={item.body} id={`entry-body-${item.id}`} collapsed={!expanded.has(item.id)&&articleText(item.body).split(/\s+/).length>70}/>:(<p id={`entry-body-${item.id}`} className={`mt-4 whitespace-pre-wrap text-base leading-8 text-muted-foreground ${expanded.has(item.id)?"":"line-clamp-4"}`}>{item.body}</p>)}{(kind==="article"?articleText(item.body):item.body).trim().split(/\s+/).length>70&&<Button size="sm" className="mt-5 h-9 rounded-sm px-5 text-[13px] font-bold text-dark hover:bg-gold/90" aria-expanded={expanded.has(item.id)} aria-controls={`entry-body-${item.id}`} onClick={()=>toggle(item.id)}>{expanded.has(item.id)?"Show less":"Read more"}</Button>}{kind==="article"&&item.published&&<JournalComments entryId={item.id}/>}<p className="mt-5 text-xs text-muted-foreground">Samuel Ato Afful · {Math.max(1,Math.ceil((kind==="article"?articleText(item.body):item.body).split(/\s+/).length/200))} min read</p></div>
  </article> : <article key={item.id} className="mb-5 break-inside-avoid overflow-hidden border border-border bg-card"><Media entry={item}/>{!!item.extra_media?.length&&<div className="grid grid-cols-3 gap-1 p-1">{item.extra_media.map(m=><Media key={m.path} entry={{...item,image_url:m.url,image_path:m.path}} className="aspect-square w-full bg-secondary object-cover"/>)}</div>}<div className="p-6"><p className="eyebrow text-sage">{item.category || kind} {item.occurred_on && `· ${item.occurred_on}`}</p><h3 className="mt-3 text-xl font-bold">{item.title}</h3><p id={`entry-body-${item.id}`} className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p></div></article>)}</div>;
}
