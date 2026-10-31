import fs from "node:fs";
import path from "node:path";

export const contentSlugs = ["local-ai", "printer", "keyboards", "lab"] as const;
export type ContentSlug = (typeof contentSlugs)[number];

/**
 * Reads a content markdown file at build time (static export bakes it in).
 * The first `# ...` line (the page title) is stripped — pages render their
 * own <h1> and pass the same title.
 *
 * Content is self-authored and sanitized per PLAN.md §4 — rendered with
 * `marked`, no sanitization library needed for trusted input.
 */
export function getContent(slug: ContentSlug): string {
  const file = path.join(process.cwd(), "content", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  return raw.replace(/^# [^\n]+\n+/, "");
}

/** The `# ...` title line of a content file (used to render the page h1). */
export function getContentTitle(slug: ContentSlug): string {
  const file = path.join(process.cwd(), "content", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^# (.+)\n/);
  return match ? match[1] : slug;
}

// ---------------------------------------------------------------------------
// Water diversion info pages (content/water/bear-river/<slug>.md).
//
// These are self-authored research pages for the Bear River dashboard's four
// diversions, rendered at /water/bear-river/diversions/<slug>. They live in a
// nested content path (not the flat top-level depth pages above) and are
// loaded by slug.

/** Slugs of the Bear River diversion info pages, in dashboard order. */
export const bearRiverDiversionSlugs = ["canals", "brmd", "brid", "bcid"] as const;
export type BearRiverDiversionSlug = (typeof bearRiverDiversionSlugs)[number];

function readContentFile(relPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", relPath), "utf8");
}

/** Body of a Bear River diversion page, with the leading `# Title` stripped. */
export function getBearRiverDiversion(slug: BearRiverDiversionSlug): string {
  const raw = readContentFile(`water/bear-river/${slug}.md`);
  return raw.replace(/^# [^\n]+\n+/, "");
}

/** The `# ...` title of a Bear River diversion page. */
export function getBearRiverDiversionTitle(slug: BearRiverDiversionSlug): string {
  const raw = readContentFile(`water/bear-river/${slug}.md`);
  const match = raw.match(/^# (.+)\n/);
  return match ? match[1] : slug;
}
