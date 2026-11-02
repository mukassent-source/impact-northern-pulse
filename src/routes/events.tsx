import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/components/site/sections";

export const Route = createFileRoute("/events")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Events | Samuel Ato Afful" },
    { name: "description", content: "Conferences, youth forums, media events, workshops and community conversations — engagements published and updated by Samuel Ato Afful." },
    { property: "og:title", content: "Events | Samuel Ato Afful" },
    { property: "og:description", content: "Gatherings and engagements across media, youth empowerment and community development." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/events" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/events" }] }), component: EventsRoute,
});

function EventsRoute() {
  return <main><EventsPage /></main>;
}
