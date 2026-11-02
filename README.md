# Ava Roubanian

Portfolio site for artist Ava Roubanian: artwork, photography and music.

Live at [avaroubanian.com](https://avaroubanian.com).

## What's on it

- `/visual` is the artwork and photography gallery.
- `/audio` is the music library, with a player on the page.
- `/admin` is Sanity Studio, embedded in the site. Ava edits everything there.

## Stack

Next.js, TypeScript, Tailwind CSS, Sanity, deployed on Vercel.

## Running it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The Studio is at http://localhost:3000/admin (Sanity login required). The Sanity project id, dataset and API version are set in `vercel.json`.

To run the Studio on its own (port 3333):

```bash
cd sanity
npm install
npm run dev
```

Schema types live in `sanity/schemaTypes/`. The shared config is `sanity.config.ts` at the repo root.

## Images

Sanity images go through `src/lib/sanityImageLoader.ts` via the `SanityImage` component (`src/components/SanityImage.tsx`), so resizing happens on Sanity's CDN instead of Vercel Image Optimization (the team's shared monthly quota). Use `SanityImage` for any new Sanity image, and always set `sizes` on responsive or `fill` images.

## Deploy

Deployed on Vercel from this repo. Env vars:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_*` | Already in `vercel.json` |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the Sanity webhook that calls `POST /api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical URL for metadata |

In Sanity (project settings > API):

- CORS origins: `http://localhost:3000` and `https://avaroubanian.com`
- Webhook: `https://avaroubanian.com/api/revalidate`, dataset `production`, on create/update/delete, POST, with the same secret as `SANITY_REVALIDATE_SECRET`

Published changes show up on the site within seconds, no redeploy needed.

## License

All rights reserved. The code is public to view, not licensed for reuse.
