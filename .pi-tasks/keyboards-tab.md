# Task: Break out Keyboards & Mice into its own prominent section / tab

Request: "i think we should break out this keyboard-and-mouse section into a
bigger, more prominent section, maybe even its own tab" — current setup:
two Vortex 40% keyboards, a QMK-modded ZSA Moonlander, Apple trackpad (no
mouse), Vortex sandwiched between the Moonlander halves, Ploopy under the
Moonlander bottom-right near the thumb cluster, A5 cutting mat under the
Vortex for print cleanup.

## Spec

Promote the input stack to a first-class depth page `/keyboards` with its own
nav tab (matching the existing Local AI / Printer / Lab pattern: nav entry →
`content/*.md` → `ContentPage`), add three new project cards for the devices
not yet on the grid (Vortex, Moonlander, Apple Trackpad), move the two Ploopy
cards from the maker section into the new "Keyboards & Mice" section on
/projects, add a fourth front-door on the home page, and update all affected
tests/docs. Card count goes 16 → 19. Facts used are exactly what the user
stated — no invented specs.

## Tasks

1. **Data model** — `projects.ts`: add `"keyboards"` to `Category`, add
   vortex-core40 / moonlander / apple-trackpad cards (all `href: "/keyboards"`
   → depth page), move qmk-ploopy + nano-2-trackball to `keyboards` category;
   `content.ts`: add "keyboards" slug; `site.ts`: nav entry
   "Keyboards & Mice" → /keyboards (after Printer, before Lab).
   Tests first: `projects.test.ts` (19 cards; agents 9, maker 2, keyboards 5,
   lab 3; allow /keyboards href; ploopy cards must be `keyboards` category),
   `site.test.ts` (nav contains /keyboards). Accept: `npx vitest run` green.

2. **Depth page** — `content/keyboards.md` (intro + "The keyboards" +
   "The layout" + "The pointer"; links to /printer, /projects#qmk-ploopy,
   /projects#nano-2-trackball) + `src/app/keyboards/page.tsx` (printer-page
   pattern). Register in `routes.test.tsx` (new describe + projects 16→19 +
   home door assertions), `a11y.test.tsx` pages map, `prefetch.test.tsx`
   FILES. Accept: vitest green incl. axe on the new route.

3. **Surfaces** — home: fourth door (/keyboards), "Three doors"→"Four doors",
   grid 3→4 cols, glance row 16→19 count; /projects: new "Keyboards & mice"
   group (blurb + link to the tab), maker group gets /printer link, metadata
   16→19. Accept: vitest green, copy consistent.

4. **Docs + gates** — PLAN.md §3: add /keyboards IA row, card list 16→19
   (maker 2, keyboards 5) with a dated change note; run full `npx vitest run`,
   `npm run build`, `npm run lint`; verify `out/` (keyboards page present,
   grep gate, no banned terms in new copy). Accept: all gates green.

5. **Ship** — commit, `wrangler pages deploy out`, curl live
   /keyboards + /projects + /, imessage confirmation. Accept: live verified.

## Assumptions (stated, not blocking)

- Nav label "Keyboards & Mice" (user's own wording); page H1 same.
- "Vortex 40%" is written as the user phrased it; no vendor invented.
- Two Vortex exist; the desk layout uses one. The second's role is not
  stated on the site.

---

## Status: COMPLETE (2026-07-08)

- [x] Task 1 data+nav — commit `373f538` (19 cards: 9/2/5/3; nav tab Keyboards & Mice)
- [x] Task 2 route + Task 3 surfaces — commit `34a342e` (`content/keyboards.md`, `/keyboards` route, /projects group + lead link, home fourth door, test registrations; vitest 88/88)
- [x] Task 4 docs+gates — commit `34b761d` (PLAN.md; vitest 89/89, lint clean, build 11 routes, build-gate green on fresh `out/`)
- [x] Task 5 ship — deployed `34b761d` (preview b65dc5fe); live-verified jakejacobson.info: `/keyboards` 200 with correct copy, home has the fourth door, `/projects` renders 19 cards with the Ploopy cards as trackballs in the Keyboards & Mice section. iMessage sent to +14353748609.
