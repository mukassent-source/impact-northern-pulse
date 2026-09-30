import { createFileRoute } from "@tanstack/react-router";
import { LeadershipPage } from "@/components/site/sections";

export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: [
    { title: "Leadership | Samuel Ato Afful" },
    { name: "description", content: "Leadership with purpose — principles of people-first, innovation, collaboration and sustainability guiding Samuel Ato Afful's work." },
    { property: "og:title", content: "Leadership | Samuel Ato Afful" },
    { property: "og:description", content: "Credible leadership begins with listening, collaboration and a commitment to lasting value." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/leadership" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/leadership" }] }), component: LeadershipRoute,
});

function LeadershipRoute() {
  return <main><LeadershipPage /></main>;
}
