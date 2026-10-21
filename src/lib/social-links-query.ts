import { queryOptions } from "@tanstack/react-query";
import { getEntries } from "./content";
import { publishedSocialLinks } from "./social-links";

export const socialLinksQuery = queryOptions({
  queryKey: ["content", "social"],
  queryFn: async () => publishedSocialLinks(await getEntries("social")),
});