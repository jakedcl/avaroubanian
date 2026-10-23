# AGENTS.md — avaroubanian

Portfolio site for artist Ava Roubanian: visual work (artwork, photography), audio, a shop page, and a bio.

## Stack
- Next.js 15.2 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion 12.
- Sanity project `z85vvbbq`, dataset `production`, read via next-sanity 9 (`src/lib/sanity.ts`).
- Embedded Sanity Studio at `/admin` (`sanity.config.ts` at repo root). Legacy `sanity/` folder holds schema types and optional local `npm run dev` against the shared config.
- Vercel. `vercel.json` sets the public Sanity env vars (API version 2023-05-03).

## Layout
- `src/app/(site)/` home, `visual/`, `audio/`, `shop/`, and `api/visual`, `api/audio` (Sanity reads).
- `src/app/admin/` embedded Studio (no site shell).
- `src/components/` content sections, `FilmStrip.tsx` + `FilmStrip.module.css`, `ImageModal`, `ContactPanel`, `SiteShell`, `home/`.
- `sanity/schemaTypes/` site settings, artwork, photography, audio, legacy bio.
- `FILMSTRIP_PORTING_GUIDE.md` documents the film strip ported from the christianmauldin repo.

## Commands
- Site: `npm run dev`, `npm run build`, `npm run lint`.
- Optional schema dev UI: `cd sanity && npm install && npm run dev` (uses root `sanity.config.ts`).

## Gotchas
- Two separate installs (root and `sanity/`) with different React majors. Install and run them separately.
- Site settings singleton (`siteSettings` document id) drives contact email, Instagram URL, and home bio. Code fallbacks live in `src/lib/site-defaults.ts`.
- Content cache tag `sanity`; webhook `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET`.
- Images come from `cdn.sanity.io` (allowed in `next.config.ts`).
