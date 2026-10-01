import { useQuery } from "@tanstack/react-query";
import { getEntries } from "@/lib/content";
import p6524 from "@/assets/gallery/IMG_6524.jpg.asset.json";
import p6527 from "@/assets/gallery/IMG_6527.jpg.asset.json";
import p6528 from "@/assets/gallery/IMG_6528.jpg.asset.json";
import p6529 from "@/assets/gallery/IMG_6529.jpg.asset.json";
import p6530 from "@/assets/gallery/IMG_6530.jpg.asset.json";
import p6532 from "@/assets/gallery/IMG_6532.jpg.asset.json";
import p6533 from "@/assets/gallery/IMG_6533.jpg.asset.json";
import p6534 from "@/assets/gallery/IMG_6534.jpg.asset.json";
import p6548 from "@/assets/gallery/IMG_6548.jpg.asset.json";
import p6554 from "@/assets/gallery/IMG_6554.jpg.asset.json";

const photos = [
  { src: p6554.url, alt: "Samuel Ato Afful seated in thought in his office" },
  { src: p6527.url, alt: "Samuel Ato Afful smiling at his desk" },
  { src: p6548.url, alt: "Samuel Ato Afful seated in an office chair" },
  { src: p6524.url, alt: "Samuel Ato Afful working on a laptop" },
  { src: p6528.url, alt: "Samuel Ato Afful at work at his desk" },
  { src: p6529.url, alt: "Samuel Ato Afful typing at his desk" },
  { src: p6530.url, alt: "Samuel Ato Afful focused on his laptop" },
  { src: p6532.url, alt: "Samuel Ato Afful smiling in the office" },
  { src: p6533.url, alt: "Samuel Ato Afful taking notes" },
  { src: p6534.url, alt: "Samuel Ato Afful with pen in hand" },
];

export function PhotoGallery() {
  return (
    <div className="mb-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
      {photos.map((p) => (
        <figure key={p.src} className="mb-5 break-inside-avoid overflow-hidden border border-border bg-card">
          <img src={p.src} alt={p.alt} loading="lazy" className="w-full object-cover" />
        </figure>
      ))}
    </div>
  );
}

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
