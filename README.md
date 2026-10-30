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

Deployment is **automatic** — you do **not** need `wrangler login` or to run
`wrangler` locally. A GitHub Actions workflow (`.github/workflows/deploy.yml`)
rebuilds and deploys to Cloudflare Pages on **every push to `main`**:

```bash
npm run build    # local static output in ./out (for preview / testing only)
git push         # this is the deploy — the workflow picks it up
```

- **On-demand deploy** (no push): the **Run workflow** button on the repo's
  **Actions** tab.
- **CI auth**: the workflow sets `CLOUDFLARE_API_TOKEN` (a GitHub Actions
  secret) + `CLOUDFLARE_ACCOUNT_ID`, so it never touches your local `wrangler`
  OAuth login. To (re)create that token: Cloudflare dashboard → **API Tokens**
  → *Create Custom Token* with **Cloudflare Pages → Edit** + **Account Settings
  → Read**, **no IP restriction** (Actions runners have rotating IPs), no
  expiration; store it as the `CLOUDFLARE_API_TOKEN` repo secret.
- **Manual fallback** (only if CI is ever unavailable): `wrangler login` once,
  then `npm run deploy`.

**wrangler 4.151+ gotcha**: the new `pages project create`/`deploy` delegates
to the Workers-based Pages and auto-detects Next.js → tries an OpenNext build.
This repo pins `pages_build_output_dir` in `wrangler.jsonc`; the project was
created with `--force` (classic Pages). Do not remove `--force` from that
create command if the project is ever recreated.

Custom domain: apex `A 76.76.21.21` and `www CNAME jakejacobsoninfo.pages.dev`
in Google Cloud DNS; both domains attached to the Pages project in Cloudflare.
