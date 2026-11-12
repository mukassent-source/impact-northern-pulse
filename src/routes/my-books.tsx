import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageIntro } from "@/components/site/layout";

export const Route = createFileRoute("/my-books")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "My Books | Samuel Ato Afful" },
    { name: "description", content: "E-books by Samuel Ato Afful." },
    { property: "og:title", content: "My Books | Samuel Ato Afful" },
    { property: "og:description", content: "Explore the e-book collection of Samuel Ato Afful." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MyBooks,
});

function MyBooks() {
  return <main>
    <PageIntro label="Samuel Ato Afful" title="My Books" description="The e-book collection." />
    <section className="section-wrap py-20 md:py-28">
      <div className="flex items-start gap-5 border-y border-border py-10">
        <BookOpen className="h-8 w-8 shrink-0 text-sage" aria-hidden="true" />
        <div><h2 className="text-xl font-semibold">No books published yet.</h2><p className="mt-2 text-sm text-muted-foreground">The collection is coming soon.</p></div>
      </div>
    </section>
  </main>;
}