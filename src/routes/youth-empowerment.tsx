import { createFileRoute } from "@tanstack/react-router";
import { YouthPage } from "@/components/site/sections";
export const Route = createFileRoute("/youth-empowerment")({
  head: () => ({ meta: [
    { title: "Youth Empowerment | Samuel Ato Afful" },
    { name: "description", content: "Explore the focus on youth leadership, skills, mentorship and participation across Northern Ghana." },
    { property: "og:title", content: "Youth Empowerment | Samuel Ato Afful" },
    { property: "og:description", content: "Explore the focus on youth leadership, skills, mentorship and participation across Northern Ghana." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/youth-empowerment" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/youth-empowerment" }] }),
  component: YouthPage,
});
