<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos, the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Static personal website (see PLAN.md for IA, content sources, and sanitization
rules). Everything is a client-rendered-free static export:

- `next build` outputs to `./out`; deploy with `wrangler pages deploy out`.
- No server features: no `next start`, no server actions, no route handlers
  doing I/O. If a change needs one, it needs a design decision first.
- Content for the depth pages (`/local-ai`, `/printer`, `/lab`) lives in
  `content/*.md` and is sanitized per PLAN.md §4 — no sheet names/IDs, no
  tokens, no comp, no kids' first names, no health data.

## Conventions

- Tests: Vitest (see `vitest.config.ts`) for components + project-card data.
- Grep gate: built output must contain none of the sensitive terms in PLAN.md §5.
- Commit small, verify with `npm run build` + `npm run lint` after changes.
