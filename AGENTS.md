# AGENTS.md — avaroubanian

Portfolio site for artist Ava Roubanian: visual work (artwork, photography), audio, a shop page, and a bio.

## Dev framework

This repo follows Jake's dev framework: [jakedcl/dev-framework](https://github.com/jakedcl/dev-framework) (start at its `AGENTS.md`). The framework is the source of truth; if anything in this file conflicts with it, the framework wins.

The framework repo is private. Cloud agents open it with `git clone --depth 1 https://x-access-token:${DEV_FRAMEWORK_READ_TOKEN}@github.com/jakedcl/dev-framework /tmp/dev-framework` (the token is a Cursor secret; never print or commit it).

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- Sanity project `z85vvbbq`, dataset `production`, read via next-sanity 13 (`src/lib/sanity.ts`).
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
- Two separate installs: the root uses Sanity 6 and React 19, `sanity/` still has Sanity 3 and React 18. Install and run them separately.
- Site settings singleton (`siteSettings` document id) drives contact email, Instagram URL, and home bio. Code fallbacks live in `src/lib/site-defaults.ts`.
- Content cache tag `sanity`; webhook `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET`.
- Images come from `cdn.sanity.io` (allowed in `next.config.ts`).
