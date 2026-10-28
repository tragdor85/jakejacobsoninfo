# jakejacobson.info

Personal site for **Jake B. Jacobson** — who I am, what I've built, and how my
home lab runs off a laptop, a phone, and a Raspberry Pi.

- **Stack**: Next.js (App Router, static export) · TypeScript · Tailwind CSS
- **Hosting**: Cloudflare Pages, deployed from this repo
- **Privacy**: no analytics, no cookies, no contact info — the footer says so
- **Water dashboards**: `/water` — interactive what-if models of real water
  bodies (Great Salt Lake first), built from committed USGS data, running
  entirely in the browser. Adding a lake = four JSON files under
  `src/data/water/<slug>/` + one entry in `src/lib/water/registry.ts`.
  See [PLAN.md](./PLAN.md) §3 for the platform layout.
- **Plan**: [PLAN.md](./PLAN.md) (information architecture, content sources, launch checklist)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & deploy

```bash
npm run build    # static output in ./out
npx wrangler pages deploy out --project-name jakejacobsoninfo
```

**wrangler 4.151+ gotcha**: the new `pages project create`/`deploy` delegates
to the Workers-based Pages and auto-detects Next.js → tries an OpenNext build.
This repo pins `pages_build_output_dir` in `wrangler.jsonc`; the project was
created with `--force` (classic Pages). Do not remove `--force` from that
create command if the project is ever recreated.

Custom domain: apex `A 76.76.21.21` and `www CNAME jakejacobsoninfo.pages.dev`
in Google Cloud DNS; both domains attached to the Pages project in Cloudflare.
