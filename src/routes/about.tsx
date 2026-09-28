import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/site/sections";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Samuel Ato Afful | Samuel Ato Afful" },
    { name: "description", content: "Discover the professional focus of Samuel Ato Afful across strategic media development, youth empowerment and community engagement." },
    { property: "og:title", content: "About Samuel Ato Afful | Samuel Ato Afful" },
    { property: "og:description", content: "Discover the professional focus of Samuel Ato Afful across strategic media development, youth empowerment and community engagement." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/about" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/about" }] }),
  component: AboutPage,
});
