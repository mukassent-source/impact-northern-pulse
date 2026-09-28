import { createFileRoute } from "@tanstack/react-router";
import { ImpactPage } from "@/components/site/sections";
export const Route = createFileRoute("/impact")({
  head: () => ({ meta: [
    { title: "Impact | Samuel Ato Afful" },
    { name: "description", content: "See Samuel Ato Afful’s impact focus and verified results as they become available." },
    { property: "og:title", content: "Impact | Samuel Ato Afful" },
    { property: "og:description", content: "See Samuel Ato Afful’s impact focus and verified results as they become available." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/impact" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/impact" }] }),
  component: ImpactPage,
});
