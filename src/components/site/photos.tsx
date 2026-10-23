import { useQuery } from "@tanstack/react-query";
import { getEntries } from "@/lib/content";
export function QuoteCuts() {
  const { data = [] } = useQuery({ queryKey: ["content", "quote"], queryFn: () => getEntries("quote") });
  if (!data.length) return null;
  return (
    <div className="mb-16">
      <p className="eyebrow text-sage">Quote cuts</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((q) => (
          <figure key={q.id} className="group relative aspect-[3/4] overflow-hidden border border-border bg-secondary">
            {q.image_url && <img src={q.image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <blockquote className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="block h-0.5 w-10 bg-[oklch(0.78_0.13_85)]" />
              <p className="mt-3 text-lg font-bold leading-snug">“{q.title}”</p>
              <footer className="mt-3 text-xs uppercase tracking-widest text-white/80">{q.category}</footer>
            </blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
