# jakejacobson.info — Personal Site Plan (v4)

> Plan only — no code yet. v3 added the **local-AI-manages-Google-Sheets** section
> (verified against `~/code/googlesheets` AGENTS.md + session history).
> **v4 decisions:** "AI for Humanity" (website + news scraper) is **excluded
> entirely** from the site per Jake — no card, no references; Sonos theater is
> **5.1.2** (six devices) per the verified system map, not 7.1.2; card count 16.
> v2 decisions still stand: Cloudflare Pages hosting, no contact info on the site,
> no test projects (budget, dancemanager, SonoTester, aigroup), no health-mcp,
> plus the asks: a 3D-printer custom-config section, a local-AI-setup section, a
> Home Assistant + Sonos home-lab page, a Raspberry Pi managed-with-AI-over-SSH
> section, and the Sheets how-to (kept generic — no specific sheet names/IDs).
>
> Content availability for all of these was **verified** against `~/code/googlesheets`,
> the relevant repos, and session history (`~/.pi/agent/sessions`, 390 transcripts)
> — see §4. There is enough.

## 1. Spec (one paragraph)

A fast, static personal website for **Jake B. Jacobson** at `jakejacobson.info`
(domain registered via Google Cloud, ACTIVE, no DNS records yet) that shows who he
is to friends, colleagues, and LinkedIn visitors: a senior cloud & DevOps engineer
(13+ years) who is deep in local AI, ships full-lifecycle projects, modds hardware,
and runs his home lab from a laptop-and-phone — including a Raspberry Pi he manages
with an AI agent over SSH. Pages: home, about, career/expertise, a data-driven
projects grid, and three depth pages (local AI setup — including how local AI
manages Google Sheets, the 3D printer, the home lab).
Fun with a little professionalism, privacy-first (no analytics, no cookies, no
contact info), zero job-hunting/salary/compensation content.

## 2. Decisions (settled)

1. **Stack**: Next.js 16 (App Router, actual: 16.4.2) + TypeScript + Tailwind v4, `output: 'export'`
   (static). Vitest + Testing Library. Zero trackers — the footer says so.
2. **Hosting**: **Cloudflare Pages** (confirmed). Public GitHub repo
   `tragdor85/jakejacobsoninfo` as the source. Domain moving from Google Cloud DNS to
   Cloudflare (Squarespace NS fields; DNSSEC off); the Pages project owns the custom
   domain once attached; `public/_redirects` handles www→apex and .com→.info. Auto-SSL.
   The open-source site repo is itself a talking point.
3. **No contact info** (confirmed): no email, no phone, no contact page.
   **Assumption to confirm:** footer keeps *profile* links — GitHub + LinkedIn —
   since the site is meant to be shared from LinkedIn; these are public profile
   links, not contact details. Say the word and they come out too.
4. **Excluded from the site entirely**: budget, dancemanager, SonoTester, aigroup
   (test projects), **"AI for Humanity"** (website + ai-news-scraper — no card, no
   references), health-mcp, jobradar, govutah, personalprofile, and all
   compensation/salary/offer/ISO/career-plan content. Career reads as *what I do
   and what I'm deep in* — never *what I want*.
5. **Content source**: `~/code/personalprofile/PROFILE.md` for identity/career/prose
   (with the exclusions above); depth pages come from the research inventory in §4.

## 3. Information architecture

| Route | Purpose |
|---|---|
| `/` | Hero ("I build things. Mostly locally."), at-a-glance (5 lines), 3–4 highlight cards, "explore" links to the depth pages. No contact CTA — the CTA is "see what I've built" |
| `/about` | The human: Woods Cross/SLC, dad of four, hobbies (music — full Taylor Swift catalog, running/VO2max, 3D printing, drones, home theater), how he works with AI (local-first, verify in logs, drives agents from iMessage/ish) |
| `/career` | The real arc (verified in PROFILE.md — **no Paramount, no Groove, never worked there**): 2009–2012 UK2 tech-support supervisor → 2012–present MasterControl SWE → senior L3 (14 years: automation wins, onboarding 8–12 hr → <1 hr, multi-account AWS, Jenkins). BS MIS Utah State. “Deep in, lately” list. Explicit no-job-hunting line. |
| `/projects` | The grid. Data-driven cards from `src/lib/projects.ts`, grouped: **Agents & Local AI** · **Maker & Hardware** · **Keyboards & Mice** · **Home Lab**. Each card: name, one-liner, stack, status badge (shipped/active/exploring/local), link (public repos) or "→ read more" (depth pages) |
| `/local-ai` | Depth: the M1 Max 32 GB local AI stack — Splash M1/M2 port, splash-serve + watchdog, pi as the agent hub, custom extensions, model list, "clone m1max32gaiconfig and have my setup" — plus a **"local AI manages my Google Sheets"** section (gog CLI + OAuth setup + agent workflow + gotchas, fully generic) |
| `/printer` | Depth: the Anet A8 custom config — full hardware table, profile-recovered-from-G-code archaeology, Klipper-on-Pi, camera + Fluidd, Cura reconstruction, defect analysis |
| `/keyboards` | Depth: the input stack — the desk layout (Vortex 40% sandwiched between the QMK-modded ZSA Moonlander halves, A5 cutting mat for print cleanup, Ploopy Nano 2 under the right-side thumb cluster) + the pointer story (Apple trackpad as the daily pointer, Ploopy as the stay-at-the-keyboard trackball, no mouse) |
| `/lab` | Depth: the home lab — H1: “The House”: the dual-role Pi (printer server + automation hub, agents over SSH), what the automation actually does (climate, radio devices, cameras), the Sonos 5.1.2 theater (the cloud-vs-local-API discovery) |
| `/water` | Index of the what-if water dashboards (registry-driven lake cards) |
| `/water/[slug]` | One interactive dashboard per lake (currently Great Salt Lake): pick a water year, drag the four source rivers, what-if single-year counterfactual, 5/10/15/20-year projection vs BAU, main chart with the 4,200 ft magic level + 2022 record low. Data is committed JSON (USGS), the model runs client-side, no backend |
| `/_404` | Personality page |

No contact route. Footer: privacy line + GitHub + LinkedIn (pending decision 3).

**Project cards (final list, 19):**
- *Agents & Local AI (9):* m1max32gaiconfig →`/local-ai` (public) · splash M1/M2 port (public) · splash-serve (public) · pi-imessage (public) · pi-todo/global-todo (public) · pi-tree-manager (local) · pi-memory-manager (local) · mtplx-extensions (local) · googlesheets (local, →`/local-ai` section)
- *Maker & Hardware (2):* Anet A8 Klipper mod →`/printer` · OpenSCAD printer parts (local)
- *Keyboards & Mice (5):* Vortex 40% (×2) →`/keyboards` · ZSA Moonlander (QMK-modded, split) →`/keyboards` · Apple trackpad (the daily pointer) →`/keyboards` · qmk_ploopy Ploopy Nano 2 fork (public, star card) →`/keyboards` · nano-2-trackball (local) →`/keyboards`
- *Home Lab (3):* klipperpi (the dual-role Pi) →`/lab` · Home Assistant stack →`/lab` · Sonos 5.1.2 theater →`/lab`

The two Ploopy cards are the *same device* (the fork builds the trackball) — both link to their respective repos; the desk-layout story lives on `/keyboards`.

Upstream clones (qmk_firmware, qmk_zsa) are folded into the ploopy card, not separate cards.

### Water dashboard platform (`/water`)

A small platform for water dashboards, built because more basins are planned.

- `src/lib/water/` — `model.ts` (generic water-balance model: Δh = I/A̅ − e,
  optional outflow hook), `elev-area.ts` (PCHIP elevation→area curve),
  `compute.ts` (pure what-if / projection / baseline derivations),
  `registry.ts` (one `LakeConfig` per lake), `format.ts`, `types.ts`
- `src/components/water/` — `level-chart`, `whatif-chart` (pure React SVG,
  site palette via `--chart-*` tokens), `water-dashboard` (the interactive
  composite), `water-lake-view` (page body)
- `src/data/water/<slug>/` — four committed JSON snapshots per lake
  (levels, inflows, elev_area, calibration), generated by the utahwater
  pipeline; imported at build time, no runtime fetch
- **Adding a lake** = four JSON files under `src/data/water/<slug>/` + one
  `LakeConfig` entry in `registry.ts`. Routes, metadata, and the index card
  are generated from the registry.
- The original standalone dashboard lives in `~/code/utahwater/dashboard` and
  remains the source of truth for data generation; the site copy is a
  committed snapshot. The old `/gsl` URL 301-redirects to `/water/gsl`.

## 4. Content inventory (verified in session history)

This is what the depth pages will be built from. T3 turns it into prose.

**`/local-ai`** — source: `m1max32gaiconfig` docs 01–07 (already written, public),
splash + splash-serve repos, profile §3.1–3.2:
- M1 Max 32 GB runs everything locally; no cloud inference.
- Community M1/M2 Metal port of Splash (the engine), tuned launcher, launchd watchdog.
- pi coding agent as the hub: iMessage bridge, tree/fork tools, memory manager,
  15-min-cadence headless todo worker.
- Models: Qwen 3.8 27B / 3.6 35B / 3.5 9B, gemma-4-e4b; benchmark numbers from docs.
- "Checkout the repo, run install.sh, have my stack."
- **Managing Google Sheets with local AI** (its own section on this page; kept
  **generic — no sheet names, IDs, or what any sheet tracks**):
  - *Why* — the one app you can't self-host; the fix is to keep the *thinking*
    local while the agent talks to your own Google account directly.
  - *Tool* — `gog` (gogcli): Sheets/Drive/Docs/Gmail in one Go binary,
    `brew install gogcli`.
  - *One-time auth* — Cloud Console: enable Sheets + Drive APIs → OAuth consent
    (external, your email, **publish** — Testing mode = 7-day token expiry) →
    desktop client JSON → `gog auth credentials` → `gog auth add` → verify with
    `gog auth list --check` / `doctor`. Tokens in a 0600 file keyring (macOS
    Keychain bypassed: brew binary is ad-hoc signed).
  - *Agent workflow* — local model shells out: `sheets create/update/get`,
    conditional formatting, `batch-request`, `drive search/delete`; `--values-json`
    for unambiguous writes, `--readonly` / `--dry-run` / `--json` for safety;
    **always read back to verify**.
  - *Learned the hard way* (the fun part): v4 API 400s on retired v1beta fields
    (`userEnteredFormula`, `fields`); `FORMULA_IS_TRUE` is data-validation only;
    CF formulas need the `=` prefix; `sheets get` can't read CF rules;
    `drive delete` prints `deleted false` *on success*; batch writes silently
    truncate → ≤8 rows per write, read back.
  - *Reproducibility* — 5-step re-setup for a new machine; the whole thing is
    documented in the `googlesheets` repo's AGENTS.md and referenced from
    m1max32gaiconfig — the capability ships with the machine.

**`/printer`** — source: `anet-a8` README (substantial, ready to adapt),
anet-a8 session transcripts (183 klipper mentions), Cura sessions:
- Heavily modded Anet A8: SKR Mini E3 V3, TMC2209 UART, PEI spring-steel,
  220×220 bed, 350 W PSU, fiberglass belts.
- Fun hook: the Cura profile was *recovered from G-code print files* (SETTING_3
  embedded in the G-code) — config archaeology.
- Klipper on the Pi, Fluidd/Moonraker, live libcamera OV5647 camera (1296×972@30fps),
  Cura 5.11 profile reconstruction, defect analysis (cubing, elephant foot).

**`/lab`** — source: `--Users-jake-.pi-agent--` + `--Users-jake-code--` +
`--Users-jake-code-sonosmcp--` sessions, `sonos-system-map.md`, profile §3.4.
Verified concrete "actually done" items:
- **The Pi** — `klipperpi` is one box with two jobs: 3D printer server (Klipper/
  Moonraker/Fluidd) *and* home-automation hub. Managed by an AI agent over SSH
  (`ssh klipperpi.local`): read-only exploration before touching anything,
  full rootfs backup before partition surgery, `growpart` resize procedure,
  disk hygiene (460 GB drive, cleanup reports, 63 GB of model files identified),
  `scp` critical backups, SSH keys. Plus the remote-operation style: agents run in
  tmux, driven from iMessage/ish, lid closed.
- **Home Assistant** — docker stack on the Pi: HA core, zigbee2mqtt, mosquitto,
  InfluxDB 1.8, Prometheus, camera streamer. Ecobee + room/garage/attic sensors,
  attic fan, weather/sunrise integration; HVAC history exported and analyzed for
  anomalies; room-temperature questions answered via the agent; HA MCP wired up.
- **Sonos** — 5.1.2 theater (Beam Gen 2 anchor, 2× Ones, 2× Era 300s, Sub Gen 3 —
  six devices per the verified system map),
  Apple Music, room distribution. Good-discovery hook: the Sonos cloud API
  (system collapses to the Beam), so the whole system was
  mapped via each device's local API + mDNS + LAN scan → a full system map.
  (SonoTester app is *not* mentioned — excluded.)

**Sanitization rules for all depth content**: no tokens/keys, no OAuth client JSON
filenames, no internal IPs beyond mDNS names (`klipperpi.local` is fine — it's
charming), no kids' first names, no health data, no work details beyond the career
page, no comp. **Google Sheets section is generic only**: no sheet names, sheet IDs,
or hints at what any sheet tracks (the real sheets are compensation-related —
never imply it).

## 5. Design & quality bar

- Dark by default, light toggle, honors `prefers-color-scheme`; aigroup/site's
  a11y patterns (skip-link, semantic HTML) carry over.
- "Engineer's workbench" tone: mono accents, terminal-flavored hero, plain-spoken
  prose, 1–2 playful touches (the 404 talks back).
- Zero analytics/cookies; Lighthouse ≥ 95 all four; LCP < 1s; minimal JS.
- Phone-first responsive (LinkedIn visitors open it on a phone).
- OG image per page (share previews are the distribution channel); sitemap, robots,
  canonicals.
- Tests: Vitest for components + project-card data (every card renders, links
  resolve, status badges valid); CI link-checker; `tsc --noEmit` + ESLint gates.
- **Grep gate** (test): the built site contains none of: salary, compensation,
  job-hunting, "open to opportunities", offer, resume link, email, phone,
  budget, dancemanager, sonotester, aigroup, health-mcp, jobradar, govutah.

## 6. Tasks (each ~3–5 agent turns, TDD)

**Status:** T1 ✅ (live on pages.dev; custom domain pending Squarespace NS change
→ Cloudflare Pages custom-domain attach, then remove manual DNS) · T2 ✅ ·
T3 ✅ · T4 ✅ (home + about, incl. Dr Pepper / FIZ joke) · T5 ✅ (16-card grid)
· T6 ✅ (UK2 → MasterControl arc, no Paramount/Groove, no job-hunt) ·
T7 ✅ (three depth routes render sanitized markdown) ·
T8 ✅ pre-deploy: 8 routes + 404 render; deep links fixed via heading `id`
slugs (marked ≥ 5 stopped emitting them); axe-core audit clean on all 8
routes (jsdom; color-contrast re-validated in Lighthouse's real browser);
built-output grep gate + internal link/anchor checker over `out/`;
source gate requiring `prefetch={false}` on internal `<Link>`s (kills RSC
payload prefetch; local mobile LCP 4.3s → 2.0s over HTTP/2+gzip — the
HTTP/1.1 6-connection cap in local test servers was the dominant factor,
and Cloudflare serves h2); Lighthouse mobile: perf 95–99, a11y 95–96,
best-practices 100, SEO 100, FCP ~0.8s, LCP 2.0–2.3s (green band); OG
images; `_redirects` for www/.com.
Final step: deploy + verify gates on the live site.
74 Vitest tests green, static build clean (8 routes).

1. **T1 — Scaffold + hosting + DNS.** git init repo; Next.js static scaffold
   (Tailwind/Vitest/ESLint from `website`'s configs); Cloudflare Pages wiring;
   verify https end-to-end.
   *Accept: `https://jakejacobson.info` serves the scaffold, valid SSL, www redirects.*
2. **T2 — Design system + layout shell.** Theme tokens (dark/light), container,
   nav with active states + depth-page links, footer (privacy line, GitHub, LinkedIn),
   card component, skip-link, a11y baseline. *Accept: shell renders all 8 routes as
   placeholders; Vitest covers nav/theme/card; keyboard-only pass.*
3. **T3 — Content research → drafts.** Mine session transcripts + existing docs
   (anet-a8 README, m1max32gaiconfig docs, sonos-system-map.md, `~/code/googlesheets`
   AGENTS.md, profile) into `content/local-ai.md`, `content/printer.md`,
   `content/lab.md` per the §4 inventory. *Accept: each draft ≥ 3 concrete
   "actually done" items with a source note; sanitization rules applied (incl.
   generic-only Sheets section); Jake approves each draft before T7.*
4. **T4 — Home + About.** Copy from PROFILE.md in voice (fun + professional),
   at-a-glance, highlight cards, OG images; no contact info anywhere.
   *Accept: reads as a person; OG preview verified in a share test.*
5. **T5 — Projects grid + data model.** Typed `projects.ts` (16 cards, §3 list),
   grouping, links/depth-page anchors. *Accept: cards render from data; adding a
   project = one object; tests cover rendering + the grep gate.*
6. **T6 — Career / expertise.** MasterControl arc, six expertise cards, "currently
   deep in". *Accept: grep gate passes on the rendered page.*
7. **T7 — Depth pages** (`/local-ai`, `/printer`, `/lab`) built from T3 drafts,
   incl. the Pi-over-SSH narrative in `/lab`. *Accept: Jake reads all three; content
   matches what's real; links from cards land on the right anchors.*
8. **T8 — 404, polish, launch.** Personality 404; axe a11y audit; Lighthouse; CI
   link-checker; mobile walkthrough; README with deploy docs; launch checklist
   (grep-gate on built output, LinkedIn profile updated to the URL).
   *Accept: all gates green on the live site.*

**Post-launch (out of scope):** optional `/notes` + RSS; aigroup cross-link if it
ever launches; sanitized public repos for any project Jake wants to publish;
MX/email if he later wants it published.

## 7. Open questions (minimal now)

1. Footer: keep GitHub + LinkedIn profile links, or no links at all?
2. ~~"AI for Humanity" stays as a card?~~ — **Resolved (v4): excluded entirely.**
3. `/about` photo: is there a headshot, or keep it text/monogram?
4. Anything in PROFILE.md §2 (MasterControl scope) to trim before it goes public?
