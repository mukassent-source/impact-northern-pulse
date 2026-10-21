import type { Entry } from "./content";

export type AdminMessage = { id: string; name: string; email: string; phone: string; organization: string; subject: string; message: string; created_at: string };
export function partnershipApplications(messages: AdminMessage[]) {
  return messages.filter(message => message.subject.startsWith("Partnership application"));
}
export function upcomingEvents(entries: Entry[], today: string) {
  return entries.filter(entry => entry.kind === "event" && entry.occurred_on && entry.occurred_on >= today)
    .sort((a, b) => (a.occurred_on ?? "").localeCompare(b.occurred_on ?? ""));
}