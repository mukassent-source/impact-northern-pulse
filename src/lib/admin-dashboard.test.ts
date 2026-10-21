import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { partnershipApplications, upcomingEvents } from "./admin-dashboard";
import type { Entry } from "./content";

describe("dashboard records", () => {
  test("applications exclude ordinary contact messages", () => {
    const records = ["Partnership application — NGO", "Speaking invitation"].map((subject, i) => ({ id: String(i), subject, name: "", email: "", phone: "", organization: "", message: "", created_at: "" }));
    deepStrictEqual(partnershipApplications(records).map(record => record.id), ["0"]);
  });
  test("upcoming events include today and sort by event date", () => {
    const records = [
      { id: "later", kind: "event", occurred_on: "2026-11-01" },
      { id: "past", kind: "event", occurred_on: "2026-10-20" },
      { id: "today", kind: "event", occurred_on: "2026-10-21" },
      { id: "project", kind: "project", occurred_on: "2026-11-01" },
      { id: "undated", kind: "event", occurred_on: null },
    ] as Entry[];
    deepStrictEqual(upcomingEvents(records, "2026-10-21").map(record => record.id), ["today", "later"]);
  });
});