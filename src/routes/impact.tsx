import { createFileRoute } from "@tanstack/react-router";
import { ImpactPage } from "@/components/site/sections";

export const Route = createFileRoute("/impact")({
  head: () => ({ meta: [
    { title: "Impact | Samuel Ato Afful" },
    { name: "description", content: "Impact measured with integrity — verified figures and results from Samuel Ato Afful's initiatives will be published here." },
    { property: "og:title", content: "Impact | Samuel Ato Afful" },
    { property: "og:description", content: "Verified impact figures and results, shared accurately." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/impact" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/impact" }] }), component: ImpactRoute,
});

function ImpactRoute() {
  return <main><ImpactPage /></main>;
}
