import { createFileRoute } from "@tanstack/react-router";
import { PartnershipsPage } from "@/components/site/sections";

export const Route = createFileRoute("/partnerships")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Collaboration & Partnerships | Samuel Ato Afful" },
    { name: "description", content: "Progress is a shared effort — collaboration opportunities with youth organizations, media, NGOs, institutions and development partners." },
    { property: "og:title", content: "Collaboration & Partnerships | Samuel Ato Afful" },
    { property: "og:description", content: "Meaningful development connects people, organizations and communities around common purpose." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/partnerships" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/partnerships" }] }), component: PartnershipsRoute,
});

function PartnershipsRoute() {
  return <main><PartnershipsPage /></main>;
}
