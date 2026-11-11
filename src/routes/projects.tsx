import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/site/sections";

export const Route = createFileRoute("/projects")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Projects | Samuel Ato Afful" },
    { name: "description", content: "Selected work across media, youth, community and digital development in Northern Ghana." },
    { property: "og:title", content: "Projects | Samuel Ato Afful" },
    { property: "og:description", content: "Explore initiatives across media, youth, community and digital development." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/projects" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/projects" }] }), component: ProjectsRoute,
});

function ProjectsRoute() {
  const matchRoute = useMatchRoute();
  return <>{matchRoute({ to: "/projects", fuzzy: false }) && <main><ProjectsPage /></main>}<Outlet /></>;
}
