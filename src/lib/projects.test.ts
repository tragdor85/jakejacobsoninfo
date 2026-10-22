import { describe, it, expect } from "vitest";
import { projects } from "@/lib/projects";

describe("projects data", () => {
  it("has the 19 public cards from the plan", () => {
    expect(projects).toHaveLength(19);
    const byCategory = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(byCategory.agents).toBe(9);
    expect(byCategory.maker).toBe(2);
    expect(byCategory.keyboards).toBe(5);
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
      "ai for humanity",
      "ai-news-scraper",
    ]) {
      expect(blob).not.toContain(banned);
    }
  });

  it("has unique slugs and resolvable hrefs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const hrefs = new Set(projects.flatMap((p) => [p.href, p.repo]));
    for (const href of hrefs) {
      if (!href) continue;
      if (href.startsWith("http")) continue;
      expect(["/projects", "/local-ai", "/printer", "/lab", "/keyboards"]).toContain(href);
    }
  });

  it("no card self-links to the projects page (the old broken-link bug)", () => {
    for (const p of projects) {
      expect(p.href, `"${p.slug}" self-links to /projects`).not.toBe("/projects");
    }
  });

  it("every public GitHub link points at a repo URL", () => {
    const repoUrls = projects.flatMap((p) => [p.href, p.repo]).filter((u) => u?.startsWith("http"));
    expect(repoUrls.length).toBeGreaterThan(0);
    for (const url of repoUrls) {
      expect(url, url).toMatch(/^https:\/\/github\.com\/[^\/\s]+\/[^\/\s]+$/);
    }
  });

  it("links the m1 max config to both the local-ai page and GitHub", () => {
    const m1 = projects.find((p) => p.slug === "m1max32gaiconfig");
    expect(m1?.href).toBe("/local-ai");
    expect(m1?.repo).toBe("https://github.com/tragdor85/m1max32gaiconfig");
  });

  it("describes the Ploopy Nano 2 as a trackball, not a keyboard", () => {
    const ploopyCards = projects.filter((p) => ["qmk-ploopy", "nano-2-trackball"].includes(p.slug));
    expect(ploopyCards).toHaveLength(2);
    for (const card of ploopyCards) {
      // The Ploopy lives in the Keyboards & Mice section, not maker.
      expect(card.category, `${card.slug} category`).toBe("keyboards");
      expect(card.tags, `${card.slug} tags`).not.toContain("keyboard");
      expect(card.tags, `${card.slug} tags`).toContain("trackball");
      expect(card.blurb, `${card.slug} blurb`).not.toContain("draw-while-you-type");
      expect(card.title + " " + card.blurb, `${card.slug}`).toContain("Ploopy Nano 2");
    }
  });

  it("the input-stack cards link to the keyboards depth page", () => {
    const inputCards = projects.filter((p) => p.category === "keyboards");
    const slugs = inputCards.map((p) => p.slug).sort();
    expect(slugs).toEqual(
      ["apple-trackpad", "moonlander", "nano-2-trackball", "qmk-ploopy", "vortex-core40"].sort(),
    );
    for (const card of inputCards) {
      expect(
        card.href,
        `${card.slug} href must be the depth page or a repo URL`,
      ).toMatch(/^\/keyboards|^https:\/\/github\.com\//);
    }
    for (const card of inputCards.filter((p) => ["vortex-core40", "moonlander", "apple-trackpad"].includes(p.slug))) {
      expect(card.href, `${card.slug} href`).toBe("/keyboards");
    }
  });

  it("the three desk devices carry the setup facts", () => {
    const vortex = projects.find((p) => p.slug === "vortex-core40")!;
    expect(vortex.title).toContain("Vortex");
    expect(vortex.title).toContain("40%");
    expect(vortex.tags).toContain("keyboard");

    const moonlander = projects.find((p) => p.slug === "moonlander")!;
    expect(moonlander.title).toContain("Moonlander");
    expect(moonlander.blurb).toContain("QMK");

    const trackpad = projects.find((p) => p.slug === "apple-trackpad")!;
    expect(trackpad.title).toContain("Trackpad");
    expect(trackpad.blurb.toLowerCase()).toContain("trackpad");
  });

  it("points the pi-imessage card at its public repo", () => {
    expect(projects.find((p) => p.slug === "pi-imessage")?.href).toBe(
      "https://github.com/tragdor85/pi-imessage",
    );
  });
});
