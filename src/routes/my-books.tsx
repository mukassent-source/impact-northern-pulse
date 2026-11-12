import { createFileRoute } from "@tanstack/react-router";
import { BookLibrary, booksQuery } from "@/components/site/book-library";
import { PageIntro } from "@/components/site/layout";

export const Route = createFileRoute("/my-books")({
  staticData: { sitemap: false },
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery),
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
      <BookLibrary />
    </section>
  </main>;
}