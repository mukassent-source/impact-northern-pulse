import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { publishedSocialLinks } from "./social-links";
import type { Entry } from "./content";

describe("published social links", () => {
  test("only published social records appear", () => {
    const records = [
      { id: "published", kind: "social", published: true, title: "LinkedIn", body: "https://www.linkedin.com/in/example" },
      { id: "draft", kind: "social", published: false, title: "Facebook", body: "https://www.facebook.com/example" },
      { id: "project", kind: "project", published: true, title: "Project", body: "https://example.com" },
    ] as Entry[];
    deepStrictEqual(publishedSocialLinks(records).map(link => link.id), ["published"]);
  });
  test("saved name and URL edits replace the previous values", () => {
    const record = { id: "editable", kind: "social", published: true, title: " Instagram ", body: " https://www.instagram.com/updated_profile/ " } as Entry;
    deepStrictEqual(publishedSocialLinks([record]), [{ id: "editable", name: "Instagram", href: "https://www.instagram.com/updated_profile/", network: "instagram" }]);
  });
  test("invalid and unsafe profile URLs are never linked", () => {
    const records = ["javascript:alert(1)", "http://example.com", "not a url", ""].map(body => ({ kind: "social", published: true, title: "X", body })) as Entry[];
    deepStrictEqual(publishedSocialLinks(records), []);
  });
});