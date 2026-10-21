import { test } from "node:test";
import { strictEqual, throws } from "node:assert";
import { canSignPublishedMedia, publishedMediaRequest, PUBLIC_MEDIA_URL_SECONDS } from "./media-access";

test("draft files cannot receive public download links", () => {
  strictEqual(canSignPublishedMedia({ published: false, image_url: "draft.jpg" }), false);
});
test("published portfolio files can receive short-lived download links", () => {
  strictEqual(canSignPublishedMedia({ published: true, image_url: "gallery/photo.jpg" }), true);
  strictEqual(PUBLIC_MEDIA_URL_SECONDS, 60);
});
test("external URLs and traversal paths cannot be signed", () => {
  for (const image_url of ["https://example.com/photo.jpg", "/photo.jpg", "../private.jpg", "gallery/../private.jpg", ""]) {
    strictEqual(canSignPublishedMedia({ published: true, image_url }), false);
  }
});
test("public media requests accept only bounded record IDs, not arbitrary storage paths", () => {
  throws(() => publishedMediaRequest.parse({ ids: ["private.jpg"] }));
  throws(() => publishedMediaRequest.parse({ ids: Array(101).fill("00000000-0000-4000-8000-000000000000") }));
});