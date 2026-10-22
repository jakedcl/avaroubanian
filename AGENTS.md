# AGENTS.md — avaroubanian

Portfolio site for artist Ava Roubanian: visual work (artwork, photography), audio, a shop page, and a bio.

## Stack
- Next.js 15.2 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion 12.
- Sanity project `z85vvbbq`, dataset `production`, read via next-sanity 9 (`src/lib/sanity.ts`).
- Studio is a separate app in `sanity/` (Sanity 3, React 18), deployed to the hosted studio `avaroubanian` (avaroubanian.sanity.studio). It is not embedded in the Next app.
- Vercel. `vercel.json` sets the public Sanity env vars (API version 2023-05-03).

## Layout
- `src/app/` home, `visual/`, `audio/`, `shop/`, and `api/visual`, `api/audio` (Sanity reads).
- `src/components/` content sections, `FilmStrip.tsx` + `FilmStrip.module.css`, `ImageModal`, `ContactModal`, `SiteShell`, `home/`.
- `sanity/schemaTypes/` artwork, photography, audio, bio.
- `FILMSTRIP_PORTING_GUIDE.md` documents the film strip ported from the christianmauldin repo.

## Commands
- Site: `npm run dev`, `npm run build`, `npm run lint`.
- Studio: `cd sanity && npm install && npm run dev`; `npm run deploy` publishes the hosted Studio.

## Gotchas
- Two separate installs (root and `sanity/`) with different React majors. Install and run them separately.
- `vercel.json` has a `/studio/(.*)` rewrite to `/studio/index.html`, but there's no `/studio` route in the app. Edit content at avaroubanian.sanity.studio.
- Images come from `cdn.sanity.io` (allowed in `next.config.ts`).
