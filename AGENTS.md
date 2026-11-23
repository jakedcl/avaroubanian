# AGENTS.md — avaroubanian

Portfolio site for artist Ava Roubanian: visual work (artwork, photography), audio, a shop page, and a bio.

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- Sanity project `z85vvbbq`, dataset `production`, read via next-sanity 13 (`src/lib/sanity.ts`).
- Embedded Sanity Studio at `/studio` (`/admin` redirects) (`sanity.config.ts` at repo root). `sanity/` holds schema types and Studio structure helpers only.
- Vercel. `vercel.json` sets the public Sanity env vars.

## Layout
- `src/app/(site)/` home, `visual/`, `audio/`, `shop/`, and `api/visual`, `api/audio` (Sanity reads).
- `src/app/studio/` embedded Studio (no site shell); `/admin` redirects to `/studio`.
- `src/components/` content sections, `FilmStrip.tsx` + `FilmStrip.module.css`, `ImageModal`, `ContactPanel`, `SiteShell`, `home/`.
- `sanity/schemaTypes/` site settings, artwork, photography, audio, legacy bio.
- `FILMSTRIP_PORTING_GUIDE.md` documents the film strip ported from the christianmauldin repo.

## Commands
- Site: `npm run dev`, `npm run build`, `npm run lint`.

## Gotchas
- Site settings singleton (`siteSettings` document id) drives contact email, Instagram URL, and home bio. Code fallbacks live in `src/lib/site-defaults.ts`.
- Content cache tag `sanity`; webhook `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET`.
- Images come from `cdn.sanity.io` (allowed in `next.config.ts`).
