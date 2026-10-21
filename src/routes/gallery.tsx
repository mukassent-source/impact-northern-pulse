import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/site/sections";

export const Route = createFileRoute("/gallery")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Gallery | Samuel Ato Afful" },
    { name: "description", content: "A visual archive of verified programs, conversations and places across Northern Ghana." },
    { property: "og:title", content: "Gallery | Samuel Ato Afful" },
    { property: "og:description", content: "A visual archive of verified programs, conversations and places." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/gallery" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/gallery" }] }), component: GalleryRoute,
});

function GalleryRoute() {
  return <main><GalleryPage /></main>;
}
