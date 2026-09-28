import { createFileRoute } from "@tanstack/react-router";
import { LeadershipPage } from "@/components/site/sections";
export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: [
    { title: "Leadership With Purpose | Samuel Ato Afful" },
    { name: "description", content: "Explore the people-first principles guiding Samuel Ato Afful’s leadership and professional engagements." },
    { property: "og:title", content: "Leadership With Purpose | Samuel Ato Afful" },
    { property: "og:description", content: "Explore the people-first principles guiding Samuel Ato Afful’s leadership and professional engagements." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/leadership" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/leadership" }] }),
  component: LeadershipPage,
});
