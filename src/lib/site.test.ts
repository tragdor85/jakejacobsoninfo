import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site";

describe("siteConfig", () => {
  it("has the real domain and a maker-flavored tagline", () => {
    expect(siteConfig.domain).toBe("jakejacobson.info");
    expect(siteConfig.name).toBe("Jake B. Jacobson");
    expect(siteConfig.tagline).toBeTruthy();
  });

  it("nav covers every route in the plan", () => {
    const paths = siteConfig.nav.map((n) => n.href);
    for (const expected of [
      "/",
      "/about",
      "/projects",
      "/career",
      "/local-ai",
      "/printer",
      "/keyboards",
      "/lab",
    ]) {
      expect(paths).toContain(expected);
    }
    // no contact route
    expect(paths).not.toContain("/contact");
  });

  it("nav links are unique and ordered home-first", () => {
    const paths = siteConfig.nav.map((n) => n.href);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths[0]).toBe("/");
  });
});
