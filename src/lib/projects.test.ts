import { describe, it, expect } from "vitest";
import { projects } from "@/lib/projects";

describe("projects data", () => {
  it("has the 17 public cards from the plan", () => {
    expect(projects).toHaveLength(17);
    const byCategory = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(byCategory.agents).toBe(10);
    expect(byCategory.maker).toBe(4);
    expect(byCategory.lab).toBe(3);
  });

  it("excludes the private/comp/health projects", () => {
    const blob = projects.map((p) => `${p.title} ${p.blurb}`).join(" ").toLowerCase();
    for (const banned of [
      "budget",
      "dancemanager",
      "sonotester",
      "aigroup",
      "health-mcp",
    ]) {
      expect(blob).not.toContain(banned);
    }
  });

  it("has unique slugs and resolvable hrefs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const hrefs = new Set(projects.map((p) => p.href));
    for (const href of hrefs) {
      expect(["/projects", "/local-ai", "/printer", "/lab"]).toContain(href);
    }
  });
});
