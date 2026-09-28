import { createFileRoute } from "@tanstack/react-router";
import { PartnershipsPage } from "@/components/site/sections";
export const Route = createFileRoute("/partnerships")({
  head: () => ({ meta: [
    { title: "Collaboration & Partnerships | Samuel Ato Afful" },
    { name: "description", content: "Explore ways to collaborate with Samuel Ato Afful and learn about future verified partnerships." },
    { property: "og:title", content: "Collaboration & Partnerships | Samuel Ato Afful" },
    { property: "og:description", content: "Explore ways to collaborate with Samuel Ato Afful and learn about future verified partnerships." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/partnerships" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/partnerships" }] }),
  component: PartnershipsPage,
});
