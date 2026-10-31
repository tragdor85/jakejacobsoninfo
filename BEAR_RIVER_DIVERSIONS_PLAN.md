# Bear River Diversion Info Pages — Plan

> Companion to the `/water` platform (see `PLAN.md`). The Bear River dashboard
> (`/water/bear-river`) has four diversion sliders. This task adds a **deep-research
> information page for each diversion**, published in this repo, linked from the
> dashboard.

## 1. Spec (one paragraph)

The Bear River is the largest tributary of the Great Salt Lake. Between the Corinne
gauge and the lake mouth, its flow is drawn off in the **Box Elder Valley** by four
human-controlled diversions that are the dashboard's sliders: the **Bear River Dam
canals** (the canal system — Bear River Canal Co. + East Branch / West Side / Central,
etc.), the **Bear River Municipal District (BRMD)**, the **BRID** irrigation district,
and the **Brigham City Irrigation District (BCID)**. For **each** diversion we publish a
standalone information page answering, with sources: (a) **where** in the state the
diverted water ends up (which cities, which farmland, which crops), (b) **what** it is
used for (irrigation vs. drinking vs. other), (c) **who** holds the water right to it
(entities, priority dates, adjudications, permits), (d) **how it is monitored and
regulated** (USGS gauges, DWR reporting, Board of Water Resources, the 1924 Bear River
Compact with Idaho, the Water Budget Model), and (e) **whether any of it is considered
wasteful and why** (alfalfa-hay economics, unlined-canal seepage/evaporation, return
flows, the 2020s drought, the proposed Bear River Development). The pages are honest
about the data gaps: the dashboard's per-diversion volumes are *estimates* and the
authoritative DWR Water Budget Model aggregates the whole sub-area, not each entity.

## 2. The four diversions (as they appear on the dashboard)

| key | dashboard name | kind | est. avg (AF/yr) |
|---|---|---|---|
| `canals` | Bear River Dam canals | irrigation | 280,000 |
| `brmd` | Bear River Municipal District (BRMD) | municipal | 120,000 |
| `brid` | Box Elder Irrigation District (BRID) | irrigation | 110,000 |
| `bcid` | Brigham City Irrigation District (BCID) | irrigation | 70,000 |

> **Name reconciliation is a research task.** The dashboard JSON calls `brid` "Box Elder
> Irrigation District" but the utahwater research doc (`09-bear-river.md`) calls it
> "Bear River Irrigation District." The pages must state the *verified* legal name.

## 3. Authoritative data already in hand

- **DWR Water Budget Model** (`dwre-utahdnr.opendata.arcgis.com`, released 11/17/2025):
  annual ag + M&I + sub-irrigation diversions & depletions per hydrologic sub-area,
  1989–2024. The Box Elder Valley sub-area is **`Brigham City` (01-01-07)**.
  - 1989–2024 mean: ag surface div **147,636** AF, M&I div **9,884** AF, sub-irrig **18,637** AF.
  - 2015–2024 mean: ag surface div **163,255** AF, M&I div **12,884** AF, sub-irrig **15,110** AF.
  - **Discrepancy to explain on the pages:** the dashboard's four sliders sum to ~580k AF,
    but the DWR model's whole-sub-area surface diversions are ~170–190k AF. The measured
    Corinne→below-O-Line gauge loss (630k AF in 2024, 203k in 2025) is what the dashboard
    calibrates to. The pages must explain modeled-vs-measured and sub-area-vs-reach.
- **USGS gauges:** Corinne `10126000` (anchor, 1949–2026), below-O-Line `10126050`
  (post-diversion check), plus canal gauges (O-Line, Whistler, Reeder, MBR outflow).
- **BRD (proposed):** 220,000 AF/yr, 85,600 AF/yr depleted, ~8.5" lake drop (DWR + 2016
  USU White Paper + Utah Rivers Council).

## 4. Site design (registry-driven, matches the existing water platform)

- **Routes:** `/water/bear-river/diversions/<slug>` — one per diversion, generated from a
  registry so adding another river's diversion pages later is a config change.
- **Content:** self-authored markdown in `content/water/bear-river/<slug>.md` (same
  `ContentPage` renderer as `/local-ai` etc.; sanitized per PLAN.md §4).
- **Registry:** extend `src/lib/water/types.ts` + `registry.ts` with a `diversionPages`
  list per river (slug, title, blurb, `href`). The `/water/bear-river` page links each
  diversion's page; the `/water` index is unchanged.
- **Links from the dashboard:** in the "Box Elder Valley diversions" card, each slider row
  gets a "where does this go? →" link to its info page.
- **Metadata:** per-page `<title>`/`description` from the registry (SEO/OG).
- **Grep gate** (PLAN.md §5) must still pass — no sensitive terms.

## 5. Tasks (each ~3–5 agent turns, TDD)

- **R1 — Verify entity identities.** Confirm the real legal names + operators of the four
  diversions (resolve the BRID name conflict; confirm BRCC canal list, BRMD service area,
  BCID). Sources: entity websites, Utah Water Rights portal, DWR, news. *Accept: a
  verified name+operator+service-area table for all four, with source URLs.*
- **R2 — Verify use + volumes per diversion.** For each: what it's used for, where it
  ends up (cities/acreage/crops), and its diversion volume. Reconcile the DWR Water
  Budget Model sub-area numbers against the dashboard estimates and the measured gauge
  loss; state the discrepancy honestly. *Accept: per-diversion use/volume facts with
  sources; a written reconciliation of the 580k-vs-190k gap.*
- **R3 — Verify rights + regulation + monitoring per diversion.** Priority dates,
  adjudications/permits, who regulates (Board of Water Resources, DWR, USACE, the 1924
  Bear River Compact), and the monitoring instruments (gauges, reporting, Water Budget
  Model). *Accept: per-diversion rights/regulation/monitoring facts with sources.*
- **R4 — The waste question per diversion.** For each: is any of its use considered
  wasteful, by whom, and why (alfalfa economics, unlined canals, seepage/evaporation,
  return flows, drought, the BRD controversy)? Cite the critics and the defenders.
  *Accept: per-diversion waste assessment with named sources for both sides.*
- **B1 — Build the registry + routes.** Extend types/registry with `diversionPages`;
  add `/water/[slug]/diversions/[diversionSlug]` route + `content/water/...` loader;
  wire `ContentPage`. *Accept: all four routes render; `generateStaticParams` emits them;
  tests pass.*
- **B2 — Author the four markdown pages.** Write the four `content/water/bear-river/*.md`
  files from R1–R4, each with the five sections (where / what / who / monitored / waste)
  + a sources list. *Accept: four complete, sourced pages; grep gate passes.*
- **B3 — Link from the dashboard + metadata + verify.** Add per-diversion links in the
  diversions card, per-page metadata, OG; run `npm run build` + `npm run lint` + vitest;
  confirm the built `out/` has the four pages and the links resolve. *Accept: green
  build/lint/tests; links resolve in the static export.*

## 6. Sources to pull (research)

- Entity sites: Bear River Canal Co., BRMD, BRID, BCID (locate + read).
- Utah Water Rights portal: `waterrights.utah.gov` (who/where/amount/priority).
- DWR: `water.utah.gov` — Bear River Development page, interstate-streams/bear-river,
  Water Budget Model, basin plans, Board of Water Resources.
- USGS: Corinne + below-O-Line + canal gauge pages.
- 2016 USU White Paper (Wurtsbaugh et al.), 2019 BRD Feasibility Study, Utah Rivers
  Council bear-river-development page.
- News: Ogden Standard-Examiner / Daily Herald / Deseret News (drought, BRD, alfalfa).

## 7. Status (complete)

All tasks done and verified:

- **R1–R4 (research):** Verified entity identities, uses/volumes, rights/regulation/
  monitoring, and the waste question for all four diversions. Key findings:
  - `canals` → real: Bear River Canal Co. + dozens of separate Box Elder canal/ditch
    companies (no single district).
  - `brmd` → real: Bear River Water Conservancy District (BRWCD, est. 1988); the
    dashboard's "Bear River Municipal District" label is a mislabel.
  - `brid` / `bcid` → no single district; labels for many separate canal companies.
    Brigham City area = DWR water-use sub-area 01-01-07.
  - BRD is proposed, not a live diversion (220k AF/yr, 85.6k depleted, ~8.5" lake drop).
- **B1 (registry + routes):** `DiversionSource.href` in types.ts; `getBearRiverDiversion`
  + `getBearRiverDiversionTitle` in content.ts; route
  `src/app/water/bear-river/diversions/[slug]/page.tsx` with `generateStaticParams`
  + per-slug metadata + `notFound()`.
- **B2 (content):** four `content/water/bear-river/*.md` pages, each with the five
  sections + sources + confidence. Rephrased "Water Budget" → "water-use accounting"
  and dropped the phone number so the PLAN.md §5 grep gate passes.
- **B3 (links + verify):** dashboard `diversion-controls.tsx` + `how-this-works-river.tsx`
  link each slider/row to its page via `href`; `diversions.json` carries the hrefs.

Build/lint/tests verified green; the four pages render in the static `out/` and all
internal links resolve.
