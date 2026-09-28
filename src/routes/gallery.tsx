import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/site/sections";
export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Gallery | Samuel Ato Afful" },
    { name: "description", content: "A visual archive for verified moments from programs, media activity and community engagement." },
    { property: "og:title", content: "Gallery | Samuel Ato Afful" },
    { property: "og:description", content: "A visual archive for verified moments from programs, media activity and community engagement." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/gallery" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/gallery" }] }),
  component: GalleryPage,
});
