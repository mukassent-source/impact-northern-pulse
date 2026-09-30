import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/site/sections";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [
    { title: "Insights & Perspectives | Samuel Ato Afful" },
    { name: "description", content: "Perspectives on media, youth development, community, leadership and the ideas shaping Northern Ghana." },
    { property: "og:title", content: "Insights & Perspectives | Samuel Ato Afful" },
    { property: "og:description", content: "Articles and perspectives on media, youth development and community leadership." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/insights" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/insights" }] }), component: InsightsRoute,
});

function InsightsRoute() {
  return <main><InsightsPage /></main>;
}
