import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/site/sections";
export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [
    { title: "Projects | Samuel Ato Afful" },
    { name: "description", content: "Explore verified and clearly labeled example projects across youth, media, community and digital development." },
    { property: "og:title", content: "Projects | Samuel Ato Afful" },
    { property: "og:description", content: "Explore verified and clearly labeled example projects across youth, media, community and digital development." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/projects" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/projects" }] }),
  component: ProjectsPage,
});
