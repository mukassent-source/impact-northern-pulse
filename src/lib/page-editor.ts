import type { Entry } from "./content";

export const editablePages = [
  { path: "/about", label: "About", sections: [["biography", "Biography"], ["journey", "Professional journey"], ["achievements", "Achievements heading"]], kinds: ["achievement"] },
  { path: "/leadership", label: "Leadership", sections: [["philosophy", "Leadership philosophy"], ["principles", "Leadership principles"], ["engagements", "Speaking engagements heading"]], kinds: ["event"] },
  { path: "/media-development", label: "Media Development", sections: [["approach", "Media approach"], ["pillars", "Media focus areas"], ["process", "Connected process"]], kinds: [] },
  { path: "/youth-empowerment", label: "Youth Empowerment", sections: [["approach", "Youth approach and focus areas"], ["quote", "Youth quotation"], ["programs", "Programs and initiatives"]], kinds: [] },
  { path: "/projects", label: "Projects", sections: [], kinds: ["project"] },
  { path: "/impact", label: "Impact", sections: [["overview", "Impact overview and figures"]], kinds: ["impact"] },
  { path: "/insights", label: "Insights", sections: [], kinds: ["article", "quote"] },
  { path: "/gallery", label: "Gallery", sections: [], kinds: ["gallery"] },
  { path: "/contact", label: "Contact", sections: [["introduction", "Contact introduction"], ["location", "Location"], ["email", "Email address"], ["phone", "Phone number"]], kinds: ["social"] },
  { path: "/partnerships", label: "Partnerships", sections: [], kinds: ["partner", "testimonial"] },
] as const;

export const pageSections = editablePages.flatMap(page => [
  { key: page.path, label: `${page.label} · page header` },
  ...page.sections.map(([key, label]) => ({ key: `${page.path}#${key}`, label: `${page.label} · ${label}` })),
]);

export function pageRecord(entries: Entry[], key: string, publishedOnly = false) {
  return entries.filter(entry => entry.kind === "page" && entry.category === key && (!publishedOnly || entry.published))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
}