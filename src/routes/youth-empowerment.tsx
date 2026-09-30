import { createFileRoute } from "@tanstack/react-router";
import { YouthPage } from "@/components/site/sections";

export const Route = createFileRoute("/youth-empowerment")({
  head: () => ({ meta: [
    { title: "Youth Empowerment | Samuel Ato Afful" },
    { name: "description", content: "Investing in the next generation — youth leadership, skills development, mentorship and digital literacy across Northern Ghana." },
    { property: "og:title", content: "Youth Empowerment | Samuel Ato Afful" },
    { property: "og:description", content: "Supporting young people as leaders, creators and partners in shaping what comes next." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/youth-empowerment" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/youth-empowerment" }] }), component: YouthRoute,
});

function YouthRoute() {
  return <main><YouthPage /></main>;
}
