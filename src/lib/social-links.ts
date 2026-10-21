import type { Entry } from "./content";

export function publishedSocialLinks(entries: Entry[]) {
  return entries.flatMap(entry => {
    if (entry.kind !== "social" || !entry.published) return [];
    try {
      const url = new URL(entry.body.trim());
      if (url.protocol !== "https:") return [];
      return [{ id: entry.id, name: entry.title.trim(), href: url.href, network: entry.title.trim().toLowerCase() }];
    } catch {
      return [];
    }
  });
}