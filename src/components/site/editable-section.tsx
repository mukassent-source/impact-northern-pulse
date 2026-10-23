import type { ReactNode } from "react";
import { Media, usePageText } from "./media";
import { SectionTitle } from "./layout";

export function EditableSection({ contentKey, children }: { contentKey: string; children: ReactNode }) {
  const custom = usePageText(contentKey);
  if (!custom) return <>{children}</>;
  return <div className="min-w-0"><SectionTitle label={custom.location} title={custom.title}/>{custom.image_url && <Media entry={custom} className="mb-8 max-h-[600px] w-full object-contain"/>}{custom.body && <div className="space-y-5">{custom.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap break-words leading-8 text-muted-foreground">{paragraph}</p>)}</div>}</div>;
}