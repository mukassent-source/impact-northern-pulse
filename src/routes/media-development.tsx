import { createFileRoute } from "@tanstack/react-router";
import { MediaPage } from "@/components/site/sections";
export const Route = createFileRoute("/media-development")({
  head: () => ({ meta: [
    { title: "Media Development | Samuel Ato Afful" },
    { name: "description", content: "Learn about media strategy, digital transformation and community-centered communication in Northern Ghana." },
    { property: "og:title", content: "Media Development | Samuel Ato Afful" },
    { property: "og:description", content: "Learn about media strategy, digital transformation and community-centered communication in Northern Ghana." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/media-development" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/media-development" }] }),
  component: MediaPage,
});
