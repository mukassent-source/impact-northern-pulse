import { describe, test } from "node:test";
import { strictEqual, deepStrictEqual, throws } from "node:assert";
import type { AnyRoute, AnyRouter } from "@tanstack/react-router";
import { isSitemapRouteIncluded, sitemapStaticPaths, sitemapXML } from "./sitemap";

describe("public sitemap decisions", () => {
  test("excluded ancestors cannot be overridden and admin is omitted", () => {
    const admin = { isRoot: false, options: { staticData: { sitemap: false } } } as AnyRoute;
    const child = { isRoot: false, options: { staticData: { sitemap: true } }, parentRoute: { options: { staticData: { sitemap: "exclude-subtree" } } } } as AnyRoute;
    strictEqual(isSitemapRouteIncluded(admin), false);
    strictEqual(isSitemapRouteIncluded(child), false);
  });
  test("static URLs follow included router pages rather than placeholder IDs", () => {
    const routes = [
      { id: "/about", fullPath: "/about", options: { staticData: { sitemap: true } } },
      { id: "/admin", fullPath: "/admin", options: { staticData: { sitemap: false } } },
      { id: "/projects/$id", fullPath: "/projects/$id", options: { staticData: { sitemap: false } } },
    ];
    const router = {
      routesById: Object.fromEntries(routes.map(route => [route.id, route])),
      buildLocation: ({ to }: { to: string }) => ({ pathname: to, publicHref: to }),
      getMatchedRoutes: (path: string) => ({ routeParams: {}, foundRoute: routes.find(route => route.fullPath === path) }),
    } as unknown as AnyRouter;
    deepStrictEqual(sitemapStaticPaths(router), ["/about"]);
  });
  test("URLs use the public domain without invented modification dates", () => {
    const xml = sitemapXML("https://atoafful.com", [{ path: "/" }, { path: "/about" }, { path: "/about" }]);
    strictEqual((xml.match(/<loc>/g) ?? []).length, 2);
    strictEqual(xml.includes("https://atoafful.com/about"), true);
    strictEqual(xml.includes("<lastmod>"), false);
    throws(() => sitemapXML("https://atoafful.com", [{ path: "//other.example/" }]));
  });
});