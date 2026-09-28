import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/site/sections";
export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [
    { title: "Insights & Perspectives | Samuel Ato Afful" },
    { name: "description", content: "Read perspectives on media development, youth opportunity, leadership and community impact." },
    { property: "og:title", content: "Insights & Perspectives | Samuel Ato Afful" },
    { property: "og:description", content: "Read perspectives on media development, youth opportunity, leadership and community impact." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/insights" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/insights" }] }),
  component: InsightsPage,
});
