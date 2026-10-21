import { z } from "zod";

export const publishedMediaRequest = z.object({
  ids: z.array(z.string().uuid()).max(100),
});

export const PUBLIC_MEDIA_URL_SECONDS = 60;

export function canSignPublishedMedia(entry: { published: boolean; image_url: string }) {
  return entry.published && entry.image_url.length > 0 && entry.image_url.length <= 1024
    && !entry.image_url.startsWith("/") && !entry.image_url.includes(":")
    && !entry.image_url.split("/").some(segment => segment === ".." || segment === ".");
}