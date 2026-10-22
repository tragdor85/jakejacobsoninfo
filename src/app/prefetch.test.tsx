import { readFileSync, readdirSync, statSync } from "node:fs";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";

// PLAN T8 perf: internal Next <Link>s prefetch RSC payloads in the background.
// On a slow connection that steals bandwidth from the LCP-critical fonts/JS,
// so every internal link opts out (prefetch={false}). The opt-out only exists
// in the client runtime, not in static markup — so this guards the *source*:
// any new internal <Link> without the opt-out fails here.

const FILES = [
  "src/app/page.tsx",
  "src/app/about/page.tsx",
  "src/app/career/page.tsx",
  "src/app/projects/page.tsx",
  "src/app/local-ai/page.tsx",
  "src/app/printer/page.tsx",
  "src/app/lab/page.tsx",
  "src/app/not-found.tsx",
  "src/components/site-header.tsx",
  "src/components/site-footer.tsx",
];

// <Link tags whose href is internal ("/..." but not protocol-relative "//").
function internalLinkTags(source: string): string[] {
  const tags: string[] = [];
  const re = /<Link\b(?:(?!<Link\b)[\s\S])*?\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const tag = m[0];
    const href = /href="([^"]+)"/.exec(tag)?.[1];
    if (href && href.startsWith("/") && !href.startsWith("//")) tags.push(tag);
  }
  return tags;
}

describe("internal links opt out of RSC prefetch", () => {
  it("every internal <Link> in the page sources sets prefetch={false}", () => {
    const offenders: string[] = [];
    let total = 0;
    for (const file of FILES) {
      const source = readFileSync(`${cwd()}/${file}`, "utf8");
      for (const tag of internalLinkTags(source)) {
        total++;
        if (!tag.includes("prefetch={false}")) {
          offenders.push(`${file} → ${/href="([^"]+)"/.exec(tag)?.[1]}`);
        }
      }
    }
    expect(total).toBeGreaterThan(5);
    expect(offenders).toEqual([]);
  });

  it("the guarded file set matches the app (sanity)", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const p = `${dir}/${name}`;
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    const found = walk("src")
      .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
      .map((f) => f.replace(/\\/g, "/"));
    const pageLike = found.filter(
      (f) =>
        f.endsWith("/page.tsx") ||
        f.includes("not-found") ||
        f.includes("site-header") ||
        f.includes("site-footer"),
    );
    expect(pageLike.sort()).toEqual([...FILES].sort());
  });
});
