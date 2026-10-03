import { useQuery } from "@tanstack/react-query";
import { getEntries, type Entry } from "@/lib/content";

export function mediaType(path = "") {
  const p = path.toLowerCase().split("?")[0];
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(p)) return "video";
  if (/\.(mp3|wav|m4a|aac|ogg|oga|flac)$/.test(p)) return "audio";
  return "image";
}

export function Media({ entry, className = "w-full object-cover" }: { entry: Entry; className?: string }) {
  if (!entry.image_url) return null;
  const type = mediaType(entry.image_path || entry.image_url);
  if (type === "video") return <video src={entry.image_url} controls preload="metadata" className={className} />;
  if (type === "audio") return <audio src={entry.image_url} controls preload="metadata" className="w-full p-4" />;
  return <img src={entry.image_url} alt={entry.title} loading="lazy" className={className} />;
}

export function usePageText(key: string) {
  const { data = [] } = useQuery({ queryKey: ["content", "page"], queryFn: () => getEntries("page") });
  return data.find((e) => e.category === key && e.published);
}
