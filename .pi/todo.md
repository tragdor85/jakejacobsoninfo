# Water Dashboard Platform — port the GSL dashboard into the site (Option B)

## Spec

Port the Great Salt Lake "What-If" Water-Level Dashboard from the standalone
utahwater app into jakejacobson.info as a **native, fully styled part of the
site** — designed as a *platform* for future water dashboards (GSL is the
first). The water-balance model and elevation→area curve become shared,
generic, typed, tested libraries (`src/lib/water/`); the UI becomes shared
React components in the site's design system (stone palette, Geist/Geist
Mono, mono uppercase labels, OS-driven dark mode — no manual theme toggle);
each lake is a data-driven entry in a lake registry (`src/lib/water/registry.ts`)
with its JSON data (levels, inflows, elev_area, calibration — ~78 KB for GSL)
committed to `src/data/water/[slug]/` and imported at build time; routes are
`/water` (index: lake door cards) and `/water/[slug]` (statically generated
per registered lake). The live `/gsl` URL 301-redirects to `/water/gsl`. The
utahwater dashboard remains the research artifact and data source of truth;
the `gsl-dashboard` Cloudflare Pages project is retired once the site version
is live. The dashboard's `app.js` is the behavioral spec — all semantics
(single-year what-if, projection with 5/10/15/20-yr horizon, BAU baseline
from long-term mean inflows, per-year calibrated evaporation, 4200 ft "magic
level" line, 2022 low marker, per-river sliders + % inputs) are preserved and
pinned by ported tests.

## Architecture

```
src/
  lib/water/
    types.ts          # LakeData, LakeConfig, chart series types
    model.ts          # generic terminal-lake water balance (port of model.js)
    elev-area.ts      # PCHIP elevation→area curve (port of elev_area.js)
    format.ts         # fmtFt / fmtMaf / fmtDeltaFt / area+sq-mi formatting
    registry.ts       # lakes: { gsl: {…config, data imports} }
    model.test.ts     # port of test_model.js (13 tests)
    elev-area.test.ts # port of test_elev_area.js (6 tests)
  data/water/gsl/
    levels.json inflows.json elev_area.json calibration.json  (copied from utahwater, ~78 KB)
  components/water/
    water-dashboard.tsx   # composite client component — app.js state machine
    level-chart.tsx       # main SVG chart (observed/what-if/projected/BAU + magic line + 2022 low)
    whatif-chart.tsx      # small start/actual/what-if chart
    year-picker.tsx       # slider + year readout
    inflow-controls.tsx   # per-river sliders + % inputs + totals
    evap-control.tsx      # evaporation % control
    horizon-select.tsx    # 5/10/15/20 years
    readouts.tsx          # end elevation / area / delta cards
  app/water/
    page.tsx              # index: intro + lake door cards (from registry)
    [slug]/page.tsx       # dashboard page: intro prose (content/[slug].md) + WaterDashboard
    [slug]/route.test.tsx # render + banned-string tests
```

## Key decisions

1. **No iframe** — native page, same origin, zero third-party requests (site is
   privacy-first: no analytics/cookies/tracking).
2. **Data imported at build time** (`src/data/`), passed as props — no runtime
   fetch, no loading state, works fully offline. Per-route code splitting keeps
   each lake's JSON in its own chunk.
3. **Generic model**: Δh = I/A_avg − e solved by fixed-point iteration on area
   (port of model.js, math unchanged). Optional `outflow(area, year)` hook
   (default 0) for future reservoir dashboards — UI for it comes with the first
   reservoir, not now.
4. **Design = site tokens only**: chart series distinguished by hue *and* line
   style — observed = fg solid, what-if = accent (amber) solid, projected =
   muted dashed, BAU = muted dotted; magic level = accent hairline; 2022 low =
   marker. Dark mode follows the OS via the site's existing
   `prefers-color-scheme` variables (no manual toggle — the site has none).
5. **Registry-driven**: adding a lake = 4 JSON files + 1 registry entry;
   `/water/[slug]` routes, the `/water` index, nav, and home door all derive
   from the registry.
6. **Units**: model in ft / acre-ft / acres (US); per-lake display units in the
   config (GSL: ft, sq mi).
7. **utahwater stays source of truth** for data generation (USGS pipeline +
   fetch scripts). The site's copy is a committed snapshot; a data refresh =
   re-run the utahwater scripts, copy the 4 JSON files, redeploy.
8. **`/gsl` → 301 → `/water/gsl`** via `redirects()` in next.config (static
   export emits `_redirects`, honored by Cloudflare Pages).
9. **Tests**: port the behavioral core of the dashboard's 82-test DOM suite as
   vitest component tests (what-if semantics, horizon 5/10/15/20 with
   independent model verification, BAU baseline, readout formatting) — not a
   1:1 DOM assertion clone.

## Data schemas (verified from utahwater/dashboard/data)

- `levels.json`: `{meta, data: [{year, start_ft, end_ft, partial, missing_days}]}` — 180 rows, 1847–2026
- `inflows.json`: `{meta, data: [{year, partial, <river>, <river>_days, <river>_missing, …, total, complete}]}` — 78 rows, 1949–2026; rivers: bear, sevier, jordan, weber
- `elev_area.json`: `[{elev_ft, area_acres}]` — flat PCHIP curve, 4180–4215 ft
- `calibration.json`: `{meta, e_ft_per_yr, e_stats, e_per_year: [{year, e, inflow_acft, area_avg_ac, h_start, h_end, bear_missing}], validation}`

## Behavioral spec (from dashboard app.js — port must preserve)

- **What-if**: pick year Y; I = Σ slider values (acre-ft); project **1 year**
  from Y's start level with per-year calibrated e(Y); show what-if end vs
  actual end + delta; small chart (start, actual end, what-if end).
- **Projection**: start year py + horizon H (5/10/15/20); what-if run uses
  slider inflow I sustained all H years; BAU run uses long-term-mean inflow
  (per-river mean of gauge years with data); both use per-year calibrated e
  (fallback: scalar mean e); readouts: end elevation (Sep 30 of py+H−1),
  area, Δ vs BAU.
- **Main chart**: observed levels 1949–2026 (start-of-year points), what-if
  point, projected line, BAU line, 4200 ft magic-level line, 2022 low marker.
- **Controls**: year slider (data range), per-river sliders with % inputs
  (synced: % ↔ absolute), evaporation % control, horizon select.
- **Defaults on load**: year = latest complete year, sliders = long-term means,
  evap = 100% (calibrated), horizon = 5; what-if + projection run on load.

## Tasks

### T1 — Data + model layer ✅ committed 249e3fd
- Copy the 4 JSON files from `utahwater/dashboard/data` → `src/data/water/gsl/`
- Port `model.js` → `src/lib/water/model.ts` (typed, generic, + optional
  outflow hook) and `elev_area.js` → `src/lib/water/elev-area.ts` (PCHIP)
- Add `types.ts` + `format.ts`
- Port `test_model.js` (13) + `test_elev_area.js` (6) to vitest
- **Accept**: model + curve typed and generic; all 19 ported tests green;
  calibration validation block (RMSE 0.183 ft etc.) preserved in the data.

### T2 — Chart components ✅ committed 5e4a3a4
- `level-chart.tsx` + `whatif-chart.tsx`: port the SVG drawing logic
  (drawMainChart / drawWhatIfChart) to declarative React SVG; series config;
  magic line; 2022 low marker; responsive; site palette via CSS vars
- Add chart color tokens (`--chart-*`) to `globals.css` (light + dark)
- Component tests: all series render, axis labels, magic line, low marker,
  responsive width
- **Accept**: both charts render every series in the site palette, light +
  dark; tests green.

### T3 — Controls + dashboard composition ✅ committed 578bf53
- `year-picker`, `inflow-controls` (per-river sliders + % + totals),
  `evap-control`, `horizon-select`, `readouts`; `water-dashboard.tsx`
  composite porting the app.js state machine (runWhatIf / runProjection /
  refreshDerived / syncPctInputs / clearProjection semantics)
- Component tests: what-if single-year semantics; horizon 5/10/15/20 with
  independent model-run verification; BAU baseline; readout formatting
- **Accept**: full interactive dashboard matches the standalone app's
  behavior (verified in browser); tests green.

### T4 — Routes, registry, site integration
- `registry.ts` (GSL entry: name, rivers, year range, data imports, magic
  level 4200 ft, 2022 record low, description) ✅ done in T3/T4
- `/water` index (lake door cards) + `/water/[slug]` (generateStaticParams,
  metadata, intro prose + WaterDashboard) — the [slug] page is an async
  wrapper (Next 16 Promise params) around sync `WaterLakeView` so jsdom
  tests can render the body
- Nav: "Great Salt Lake" → "Water"; home 5th door → Water door; "Four doors"
  heading made dynamic (`${doors.length} doors`)
- `/gsl` → 301 → `/water/gsl` via `public/_redirects` (the hand-maintained
  file wins over next.config redirects() when present)
- Route tests: `/water` + `/water/gsl` render, banned strings, redirect,
  registry-driven generation
- **Accept**: `/water` and `/water/gsl` build and render in the site design;
  `/gsl` redirects; full site suite green.

### T5 — Docs, retirement, deploy
- Delete the old iframe `gsl` page + `content/gsl.md` reference from the old
  route (content file moves to the /water/gsl intro)
- Site README + PLAN: water-platform section + "how to add a lake" recipe
  (4 JSON files + registry entry)
- utahwater dashboard README: note the public version now lives at
  jakejacobson.info/water/gsl
- Retire the `gsl-dashboard` Pages project (`wrangler pages project delete`)
- Full suite + lint + build; deploy; verify live (curl + browser, light + dark)
- **Accept**: all green, deployed, live-verified, Pages project deleted.

## Baseline facts (verified 2026-10-28)

- **Data refresh**: the dashboard data was regenerated 2026-10-27 (levels
  shifted ~18 ft vs the older snapshot: 2022 low 4189.0, 2025 4191.0→4189.7,
  2026 partial with end 4189.8). Magic level is 4200 (historic average),
  record low 4188.5 (2022-11-07 daily). The site's committed snapshots were
  copied from the current dashboard data and match it byte-for-byte.

- Live site: jakejacobson.info (Cloudflare Pages, `jakejacobsoninfo` project,
  local deploy via `wrangler pages deploy out --project-name jakejacobsoninfo`)
- Current live `/gsl`: ContentPage + iframe → gsl-dashboard.pages.dev (deployed
  last session; nav + home door present)
- Home page bug: 5 doors in the array, heading hardcoded "Four doors"
- Site theme: OS-driven only (prefers-color-scheme CSS vars, no manual toggle)
- Dashboard: 782-line app.js, 181-line model.js, 94-line elev_area.js,
  82-test DOM suite; runtime data 78 KB (2.8 MB is unused raw USGS cache)
- wrangler 4.151.3 in jakejacobsoninfo node_modules; Cloudflare auth OK
  (jake@jakejacobson.info)
