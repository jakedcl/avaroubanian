# Film strip component — porting guide for AI agents

This document describes how the **film strip** UI was designed and implemented in the Christian Mauldin portfolio codebase, so you can reimplement or adapt it in another project (e.g. Next.js + Sanity for Ava Roubanian).

**Source of truth in this repo**

| Item | Location |
|------|----------|
| Film strip UI + animation | `src/components/FilmStrip.jsx` |
| Data fetching + pairing with the large hero image | `src/components/HeroCarousel.jsx` |
| Sanity client + `urlFor` image URLs | `src/lib/sanity.js` |
| Home page usage | `src/pages/HomePage.jsx` |

**Stack note:** This repository uses **Vite + React** (not Next.js). The film strip itself is framework-agnostic React; porting to Next.js means wrapping interactive parts in a Client Component (`'use client'`) and swapping env variable names (`VITE_*` → `NEXT_PUBLIC_*`).

---

## What the film strip is

A **full-width horizontal “35mm film” strip**: black base, **perforated sprocket holes** (CSS gradients), **gold “KODAK EPP 5005”** repeating text, a **scratch texture overlay**, and a row of **16:9 “frames”** that show Sanity image assets. The strip **auto-scrolls** continuously, can be **dragged** with momentum, and each frame is **clickable** to drive a parent-controlled “featured” image (in this project, the large image above the strip).

---

## Visual / UX design

- **Film body:** `#000` background; fixed height ~140px desktop / ~110px mobile (`FILM_STRIP_HEIGHT`).
- **Sprocket holes:** Two rows (`HolesRow`) built with `repeating-linear-gradient` plus subtle diagonal noise gradients for a metallic feel.
- **Stock branding:** Repeating gold monospace text (`KodakText`) — purely decorative; change the string if you want different labeling for another client.
- **Wear:** `FilmScratchOverlay` uses `public` asset **`/film-scratches.jpg`** with `mix-blend-mode: screen`. **Copy this file into the target project’s `public/`** (this repo references it; ensure the file exists in production).
- **Frames:** Each cell is `FRAME_WIDTH` 125px (85px on small screens) with side margins; inner **exposure** area is `aspect-ratio: 16/9`, image `object-fit: cover`.
- **Frame numbers:** Gold, monospace, small `▶` prefix — mimics edge-printed frame numbers.

---

## How animation and interaction work

1. **Infinite content:** The strip renders the same image list **5 times in a row** (`frameIndices`: 5 repeats × N images). That gives enough width to loop the `translateX` offset without obvious gaps.

2. **Auto-scroll:** `requestAnimationFrame` loop advances `totalOffset` at `SCROLL_SPEED` (25px/sec scaled by ~16.67ms per frame). The inner `FilmStrip` element gets `transform: translateX(-${totalOffset}px)`.

3. **Looping:** When `totalOffset` passes one full cycle of `FRAME_WIDTH * images.length` pixels, it wraps by subtracting/adding `totalWidth` so the motion is seamless.

4. **Drag:** `mousedown` / `touchstart` on the strip sets `isDragging`, cancels the current RAF id, then `mousemove` / `touchmove` adjusts `totalOffset` and stores **momentum** (`deltaX * 0.8`). On release, momentum decays (`*= 0.95`) until auto-scroll resumes.

5. **Sync with “hero” index:** While **not** dragging and **not** in `userSelected` mode, the code estimates which frame sits near the **horizontal center of the viewport** and calls `onIndexChange(newIndex)` so the large image can stay in sync with the strip.

6. **Click:** `onFrameClick(index)` lets the parent set the main featured image and typically set `userSelected` so center-tracking does not fight the user’s choice.

**Image pipeline:** Thumbnails use `urlFor(images[index]).width(300).url()` (Sanity image URL builder). The parent hero uses a larger width (e.g. 1200).

---

## Data layer (Sanity) in this project

`HeroCarousel.jsx` loads images on mount:

```js
const [works, personal] = await Promise.all([
  client.fetch('*[_type == "work"] { images[] }'),
  client.fetch('*[_type == "personal"] { images[] }')
]);

const allImages = [
  ...works.flatMap(work => work.images || []),
  ...personal.flatMap(collection => collection.images || [])
].sort(() => Math.random() - 0.5);
```

- **Expected shape:** Each item in `images` must be a **Sanity image object** (with `_type`, `asset`, etc.) so `@sanity/image-url`’s `urlFor` works.
- **Random order:** Fisher–Yates is preferable to `sort(() => Math.random() - 0.5)` for uniform shuffle; the original uses the short `sort` form.

### For a multi-category portfolio (e.g. Photography, Artwork, Audio)

The film strip **does not care** about categories — it only needs an **array of image references**. In the target Sanity schema:

- Either run **one GROQ query** that returns all image arrays from every relevant type and **flatten** them, or
- Use **separate queries** and **concatenate** in JS (same pattern as `Promise.all` above).

Example pattern (adjust `_type` and field names to the real schema):

```groq
{
  "all": [
    ...*[_type == "photography"] { "imgs": gallery[].asset-> },
    ...*[_type == "artwork"] { "imgs": images[] },
    ...
  ]
}
```

Then flatten to a single array of image objects. **Audio** might not have stills; only include fields that are actually images.

For **stable randomness** (optional): use a seed, or shuffle **server-side** once per build/request, or pick a **deterministic subset** (e.g. first 24 after a sorted order) to avoid layout shift on hydration if you ever SSR the list.

---

## Props API (`FilmStrip.jsx`)

| Prop | Type | Role |
|------|------|------|
| `images` | Sanity image[] | Required; drives frames |
| `currentIndex` | number | Which frame is “current” for sync |
| `onFrameClick` | `(index) => void` | Click a frame |
| `userSelected` | boolean | If true, suppresses auto center-based index updates |
| `onIndexChange` | `(index) => void` | Called when auto-scroll thinks the center frame changed |

**Standalone use (strip only under a hero):** You can mount `<FilmStrip />` without a large image: provide minimal state — e.g. `currentIndex` + `setCurrentIndex`, `userSelected={false}`, and a no-op or analytics-only `onFrameClick` if clicks are not needed.

---

## Dependencies to carry over

- `styled-components` (or rewrite the same layout in CSS modules / Tailwind).
- `@sanity/client`, `@sanity/image-url`, and a shared **`urlFor`** helper.
- React hooks: `useRef`, `useEffect`.

---

## Static assets checklist

1. **`/film-scratches.jpg`** — referenced by `FilmScratchOverlay`; place in **`public/film-scratches.jpg`** (Next.js) or **`public/`** root (Vite).

---

## Known implementation quirks (fix when porting)

1. **`handleDragEnd` / `animate` scope:** In `FilmStrip.jsx`, `handleDragEnd` calls `requestAnimationFrame(animate)` but `animate` is declared **inside** `useEffect`, while `handleDragEnd` is declared **outside** that closure. That can cause **`animate` to be undefined** when drag ends. **Fix:** define `handleDragEnd` inside the same `useEffect` as `animate`, or store `animate` in a ref.

2. **Mobile frame width:** Layout uses `FRAME_WIDTH_MOBILE` for flex basis, but loop math uses `FRAME_WIDTH` only. On narrow screens, scroll/index math may **drift** from visible frames. **Fix:** use a single responsive frame width (e.g. `matchMedia` or resize observer) for both layout and `totalWidth` calculations.

3. **`HeroCarousel.jsx` duplication:** The file contains duplicate styled blocks (`FilmDecoration`, `KodakText`, etc.) that mirror `FilmStrip.jsx` but are **not used** by the rendered JSX — the strip is fully self-contained in `FilmStrip.jsx`. Safe to omit when copying to a new project.

---

## Next.js checklist (short)

1. Add `'use client'` to the component that owns `useEffect` / RAF / drag listeners.
2. Replace `import.meta.env.VITE_SANITY_TOKEN` with `process.env.NEXT_PUBLIC_SANITY_*` as appropriate; prefer **read-only CDN** for public data where possible.
3. Fetch in a **Server Component** and pass images as props into the client film strip, **or** fetch client-side like `HeroCarousel` if you need the token only on the client (less ideal for secrets — better: public dataset + no token for reads).

---

## File copy list (minimal port)

1. `src/components/FilmStrip.jsx` (and fix the `animate` / `handleDragEnd` scope + optional mobile width).
2. `src/lib/sanity.js` (adapt client config and env).
3. `public/film-scratches.jpg` (add the actual image file).

Then wire your own parent: either the full **HeroCarousel** pattern (large image + strip) or **strip-only** under the hero with a multi-type Sanity query as described above.
