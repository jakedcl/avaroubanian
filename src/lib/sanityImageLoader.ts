import type { ImageLoaderProps } from 'next/image'

// Per-image next/image loader for Sanity URLs. Sanity's CDN resizes for free;
// local /public assets keep Vercel's default optimizer.
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src
  const url = new URL(src)
  const origW = Number(url.searchParams.get('w'))
  const origH = Number(url.searchParams.get('h'))
  url.searchParams.set('w', String(width))
  // If the source URL had both w and h (a crop), keep the aspect ratio.
  if (origW && origH) url.searchParams.set('h', String(Math.round((width * origH) / origW)))
  url.searchParams.set('q', String(quality || url.searchParams.get('q') || 75))
  if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'max')
  if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format')
  return url.toString()
}
