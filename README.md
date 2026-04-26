# Brown Music Review

The website for [Brown Music Review](https://brownmusicreview.com), built with Next.js (App Router) and powered by [Cosmic CMS](https://www.cosmicjs.com/).

## Quick start

You'll need **Node 20+** and **npm**.

```bash
# 1. Clone
git clone https://github.com/fullstackatbrown/project-brown-music-review.git
cd project-brown-music-review

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Then open .env.local and fill in real Cosmic credentials.
# Get them from the BMR Cosmic dashboard (Bucket Settings → API Access)
# or ask the project owner.

# 4. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

## Architecture

- **Framework:** Next.js 16 (App Router) + React 19, styled with Tailwind v4.
- **CMS:** Articles live in [Cosmic](https://www.cosmicjs.com/) under two object types:
  - `albumrates` — short-form rated reviews (markdown body)
  - `albumreview` — long-form features (rich-text/HTML body)
- **Data layer:** All Cosmic reads go through `lib/cosmic.ts`, wrapped in `unstable_cache` with a shared `cosmic-content` tag. The `/api/revalidate` route (POST with `?secret=COSMIC_WEBHOOK_SECRET`) busts the cache on demand — wire it as a Cosmic webhook for instant publishing updates in production.
- **Images:** Cover images served from Cosmic's imgix CDN. Articles without a Cosmic-uploaded cover fall back to `public/BMR STICKER.png`.

## Project layout

```
app/                  # Next.js App Router pages
  page.tsx            # Homepage (server component) → HomeClient
  reviews/[slug]/     # Individual article pages
  api/                # Route handlers (revalidate webhook, JSON endpoints)
  components/         # Shared UI used across pages
components/           # Reusable cross-route components
lib/
  cosmic.ts           # All Cosmic SDK reads + content normalization
  types.ts            # TypeScript types for Cosmic objects
public/               # Static assets (logos, BMR sticker fallback)
__tests__/            # Vitest tests
```

## Environment variables

See `.env.example` for the full list. The minimum to boot the app:

| Variable | Required | Description |
|---|---|---|
| `COSMIC_BUCKET_SLUG` | yes | Cosmic bucket identifier |
| `COSMIC_READ_KEY` | yes | Read key from Cosmic bucket settings |
| `COSMIC_WEBHOOK_SECRET` | no | Secret used by `/api/revalidate` to authenticate webhooks |

Without the two required vars, the dev server will throw on the first article fetch.

## Useful commands

```bash
npm run dev       # Dev server with hot reload
npm run build     # Production build
npm run start     # Run the production build locally
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript typecheck
npx vitest run    # Run tests
```

## Deploying

Hosted on Vercel. Pushes to `main` trigger a deploy. Set the `COSMIC_*` env vars in the Vercel project settings (Project → Settings → Environment Variables).
