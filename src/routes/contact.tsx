import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/contact-section";
import { socialLinksQuery } from "@/lib/social-links-query";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(socialLinksQuery),
  head: () => ({ meta: [
    { title: "Contact | Samuel Ato Afful" },
    { name: "description", content: "Get in touch about collaboration, youth development, media initiatives, speaking engagements or strategic partnerships." },
    { property: "og:title", content: "Contact | Samuel Ato Afful" },
    { property: "og:description", content: "Interested in collaboration, youth development, media initiatives or speaking engagements? Get in touch." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/contact" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/contact" }] }), component: ContactRoute,
});

function ContactRoute() {
  return <main><ContactPage /></main>;
}
