import { createFileRoute } from "@tanstack/react-router";
import { AchievementsPage, AboutPage } from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Samuel Ato Afful | Strategic Media Development & Youth Empowerment" },
    { name: "description", content: "Learn about Samuel Ato Afful's professional focus on strategic media development, youth empowerment and community engagement across Northern Ghana." },
    { property: "og:title", content: "About Samuel Ato Afful" },
    { property: "og:description", content: "Strategic media development, youth empowerment and community engagement across Northern Ghana." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/about" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/about" }] }), component: AboutRoute,
});

function AboutRoute() {
  return <main><AboutPage /><AchievementsPage /></main>;
}
