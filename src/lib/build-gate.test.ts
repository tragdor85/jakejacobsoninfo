import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const OUT = path.join(process.cwd(), "out");
const TEXT_EXTENSIONS = new Set([".html", ".js", ".css", ".txt"]);

function builtTextFiles(): string[] {
  if (!fs.existsSync(OUT)) {
    throw new Error(
      "out/ is missing — run `npm run build` before the grep/link gates",
    );
  }
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return TEXT_EXTENSIONS.has(path.extname(entry.name)) ? [full] : [];
    });
  return walk(OUT);
}

// ---------------------------------------------------------------------------
// PLAN.md §5 — sensitive terms must not ship in the built site.
// Broad words that legitimately appear in our own prose (resume, email,
// phone, offer) are checked by *pattern*, not banned outright.
// ---------------------------------------------------------------------------

const BANNED_SUBSTRINGS = [
  "salary",
  "compensation",
  "open to opportunities",
  "job offer",
  "budget",
  "dancemanager",
  "sonotester",
  "aigroup",
  "health-mcp",
  "jobradar",
  "govutah",
  "ai for humanity",
  "ai-news-scraper",
  "paramount",
  "groove",
];

const BANNED_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: "email address", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ },
  {
    name: "US phone number",
    regex: /(?:\+?1[-. ]?)?(?:\(\d{3}\)|\d{3})[-. ]\d{3}[-. ]\d{4}\b/,
  },
  { name: "resume link", regex: /href="[^"]*resume/i },
];

describe("built output grep gate (PLAN.md §5)", () => {
  it.each(BANNED_SUBSTRINGS)("%s", (term) => {
    const hits = builtTextFiles().filter((f) =>
      fs.readFileSync(f, "utf8").toLowerCase().includes(term.toLowerCase()),
    );
    expect(
      hits.map((h) => path.relative(OUT, h)),
      `banned term "${term}" found in built output`,
    ).toEqual([]);
  });

  it.each(BANNED_PATTERNS)("%s", ({ name, regex }) => {
    const hits = builtTextFiles().filter((f) =>
      regex.test(fs.readFileSync(f, "utf8")),
    );
    expect(
      hits.map((h) => path.relative(OUT, h)),
      `banned pattern "${name}" found in built output`,
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// PLAN.md §6 — link checking: every internal href/src in the built pages
// must resolve to a file that exists, and every in-page fragment must
// match a real id.
// ---------------------------------------------------------------------------

const URL_ATTR_RE = /(?:href|src|content)="([^"]+)"/g;

function internalUrls(file: string): string[] {
  const html = fs.readFileSync(file, "utf8");
  const urls: string[] = [];
  for (const match of html.matchAll(URL_ATTR_RE)) {
    const url = match[1];
    if (url.startsWith("/") && !url.startsWith("//")) urls.push(url);
  }
  return urls;
}

function resolvesToFile(urlPath: string): boolean {
  // Strip cache-busting queries (Next 16 emits e.g. /favicon.ico?v=…).
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
  if (cleaned.endsWith("/")) return fs.existsSync(path.join(OUT, cleaned, "index.html"));
  return (
    fs.existsSync(path.join(OUT, cleaned)) ||
    fs.existsSync(path.join(OUT, `${cleaned}.html`)) ||
    fs.existsSync(path.join(OUT, `${cleaned}/index.html`))
  );
}

/** The .html file that serves a built path (`/lab` → out/lab.html). */
function pageFileFor(urlPath: string): string | null {
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(OUT, `${cleaned}.html`),
    path.join(OUT, cleaned, "index.html"),
    path.join(OUT, cleaned),
  ];
  const found = candidates.find(
    (c) => fs.existsSync(c) && fs.statSync(c).isFile(),
  );
  return found ?? null;
}

describe("built output link checker (PLAN.md §6)", () => {
  const pages = fs.existsSync(OUT)
    ? builtTextFiles().filter((f) => path.extname(f) === ".html")
    : [];

  it("finds the built pages", () => {
    expect(pages.length).toBeGreaterThanOrEqual(8);
  });

  for (const page of pages) {
    it(`${path.relative(OUT, page)}: internal URLs resolve`, () => {
      const broken = internalUrls(page).filter((u) => {
        const [pathPart, fragment] = u.split("#");
        if (!resolvesToFile(pathPart || "/")) return true;
        if (!fragment) return false;
        const targetFile = pageFileFor(pathPart);
        return !targetFile || !fs.readFileSync(targetFile, "utf8").includes(`id="${fragment}"`);
      });
      expect(broken).toEqual([]);
    });
  }
});
