import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/samuel-ato-afful-hero.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Samuel Ato Afful | Strategic Media Development & Youth Empowerment" },
    { name: "description", content: "Samuel Ato Afful leads strategic media development and youth empowerment initiatives focused on strengthening communities and creating opportunities across Northern Ghana." },
    { property: "og:title", content: "Samuel Ato Afful | Strategic Media Development & Youth Empowerment" },
    { property: "og:description", content: "Strategic media development and youth empowerment for stronger communities across Northern Ghana." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }), component: Home,
});

function Home() { return <main>
  <section id="top" className="relative flex min-h-[calc(100dvh-74px)] items-center overflow-hidden bg-dark text-dark-foreground">
    <img src={heroImage.url} alt="Samuel Ato Afful seated at his desk" width={1676} height={768} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center"/>
    <div className="image-shade absolute inset-0"/>
    <div className="section-wrap relative z-10 pb-24 pt-36 md:py-24"><div className="max-w-3xl"><p className="eyebrow flex items-center gap-3 text-gold"><span className="h-px w-7 bg-gold"/> Samuel Ato Afful · Northern Ghana</p><h1 className="editorial-heading mt-7 text-[clamp(3.4rem,6vw,6.5rem)]">Strategic Media.<br/>Empowered Youth.<br/><span className="text-gold">Stronger Communities.</span></h1><p className="mt-7 max-w-xl text-sm leading-7 text-dark-foreground/85 md:text-base">Samuel Ato Afful leads strategic media development and youth empowerment initiatives focused on creating opportunities, strengthening communication ecosystems and supporting sustainable community development across Northern Ghana.</p><div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 rounded-sm px-7 font-bold"><Link to="/projects">Explore My Work <ArrowUpRight/></Link></Button><Button asChild size="lg" variant="outline" className="h-12 rounded-sm border-dark-foreground/50 bg-transparent px-7 text-dark-foreground hover:bg-dark-foreground hover:text-dark"><Link to="/contact">Let's Collaborate <ArrowRight/></Link></Button></div></div></div>
  </section>
</main>; }
