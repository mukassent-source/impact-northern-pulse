import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/samuel-ato-afful-hero-v2.png.asset.json";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Samuel Ato Afful | Strategic Media Development & Youth Empowerment" },
    { name: "description", content: "Samuel Ato Afful leads strategic media development and youth empowerment initiatives focused on strengthening communities and creating opportunities across Northern Ghana." },
    { property: "og:title", content: "Samuel Ato Afful | Strategic Media Development & Youth Empowerment" },
    { property: "og:description", content: "Strategic media development and youth empowerment for stronger communities across Northern Ghana." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }), component: Home,
});

function Home() { return <main>
  <section id="top" className="relative flex h-[calc(100dvh-86px)] items-end overflow-hidden bg-dark text-dark-foreground">
    <img src={heroImage.url} aria-hidden="true" width={1852} height={849} className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.35]"/>
    <img src={heroImage.url} alt="Samuel Ato Afful seated at his desk" width={1852} height={849} fetchPriority="high" className="hero-media absolute inset-0 h-full w-full"/>
    <div className="image-shade absolute inset-0"/>
    <div className="section-wrap relative z-10 flex w-full items-end pb-12 md:pb-16"><div className="flex flex-wrap gap-3 border-l-2 border-gold pl-5 md:pl-7"><Button asChild size="lg" className="h-12 rounded-sm px-7 font-bold focus-visible:ring-offset-dark"><Link to="/projects">Explore My Work <ArrowUpRight/></Link></Button><Button asChild size="lg" variant="outline" className="h-12 rounded-sm border-dark-foreground/50 bg-dark/45 px-7 text-dark-foreground backdrop-blur-sm hover:bg-dark-foreground hover:text-dark focus-visible:ring-offset-dark focus-visible:ring-2 focus-visible:ring-gold"><Link to="/contact">Let's Collaborate <ArrowRight/></Link></Button></div></div>
  </section>
</main>; }
