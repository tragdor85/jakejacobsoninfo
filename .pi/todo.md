# GSL Dashboard Page — Implementation Plan

## Goal
Add a page to jakejacobson.info that embeds the GSL What-If Water-Level Dashboard (which remains in its own repo at ~/code/utahwater/dashboard/) via an iframe.

## Tasks
- [x] Create `content/gsl.md` — content markdown introducing the GSL dashboard
- [x] Create `src/app/gsl/page.tsx` — page component embedding the dashboard in an iframe
- [x] Update `src/lib/site.ts` — add "Great Salt Lake" to nav after "Lab"
- [x] Update `src/app/page.tsx` — add GSL as a 5th door on the home page
- [x] Update `src/app/routes.test.tsx` — add route test for GSL page
- [x] Update `src/lib/site.test.ts` — add /gsl to nav path test
- [x] Update `src/lib/content.ts` — add "gsl" to contentSlugs
- [x] Update `src/app/prefetch.test.tsx` — add gsl page to FILES list
- [x] Run `npm run build` + `npm run lint` + `npm test` to verify

## Notes
- Dashboard stays in its own repo; the site embeds it via `<iframe>` pointing to the local dashboard server (`http://jakesmacbookpro.local:8000`)
- For production, the dashboard would need to be hosted on a publicly accessible URL
- Follows the same pattern as existing depth pages (/lab, /local-ai, etc.)
- Build passes, lint clean, all 92 tests pass
