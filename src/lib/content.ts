import fs from "node:fs";
import path from "node:path";

export const contentSlugs = ["local-ai", "printer", "lab"] as const;
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
