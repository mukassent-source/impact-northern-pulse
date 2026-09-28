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
  return <><div className="mb-8 flex flex-wrap gap-2">{categories.map(cat => <Button key={cat} size="sm" variant={category===cat?"default":"outline"} onClick={()=>setCategory(cat)} className="rounded-sm">{cat}</Button>)}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filtered.map((item,index) => <article key={item.id} className="group overflow-hidden border border-border bg-card"><div className="aspect-[4/3] overflow-hidden bg-secondary"><img src={item.image_url || (index%2 ? youthImage : mediaImage)} alt={item.placeholder ? "Illustrative editorial image, not documentation of this project" : item.title} width={700} height={500} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/></div><div className="p-6"><p className="eyebrow text-sage">{item.category} {item.placeholder && "· Example placeholder"}</p><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{item.body}</p><p className="mt-4 text-xs text-muted-foreground">{item.occurred_on?.slice(0,4) || "[Year]"} · {item.location || "[Location]"}</p><p className="mt-2 text-xs text-muted-foreground">Impact: {item.metric || "[Add verified impact]"}</p><Button asChild variant="link" className="mt-3 h-auto px-0 text-foreground"><Link to="/projects/$id" params={{id:item.id}}>View Project <ArrowUpRight/></Link></Button></div></article>)}</div></>;
}
export function Entries({kind}:{kind:"article"|"event"|"gallery"|"testimonial"|"partner"|"impact"}) {
  const {data=[],isLoading} = useQuery({queryKey:["content",kind],queryFn:()=>getEntries(kind)});
  if(isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if(!data.length) return <div className="border-y border-border py-12 text-muted-foreground"><p className="text-lg">Verified {kind === "article" ? "insights" : kind === "gallery" ? "photographs" : `${kind}s`} will appear here.</p><p className="mt-2 text-sm">[Add verified {kind} details]</p></div>;
  return <div className={kind==="gallery"?"columns-1 gap-5 sm:columns-2 lg:columns-3":"grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>{data.map((item:Entry)=><article key={item.id} className="mb-5 break-inside-avoid overflow-hidden border border-border bg-card">{item.image_url && <img src={item.image_url} alt={item.title} loading="lazy" className="w-full object-cover"/>}<div className="p-6"><p className="eyebrow text-sage">{item.category || kind} {item.occurred_on && `· ${item.occurred_on}`}</p><h3 className="mt-3 text-xl font-bold">{item.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p>{kind==="article" && <p className="mt-5 text-xs text-muted-foreground">Samuel Ato Afful · {Math.max(1,Math.ceil(item.body.split(/\s+/).length/200))} min read</p>}</div></article>)}</div>;
}
