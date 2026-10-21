# jakejacobson.info

Personal site for **Jake B. Jacobson** — who I am, what I've built, and how my
home lab runs off a laptop, a phone, and a Raspberry Pi.

- **Stack**: Next.js (App Router, static export) · TypeScript · Tailwind CSS
- **Hosting**: Cloudflare Pages, deployed from this repo
- **Privacy**: no analytics, no cookies, no contact info — the footer says so
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

Custom domain: apex `A 76.76.21.21` and `www CNAME jakejacobsoninfo.pages.dev`
in Google Cloud DNS; both domains attached to the Pages project in Cloudflare.
