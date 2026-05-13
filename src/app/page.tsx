import HomeExplorer, { type CatalogTile } from '@/components/home/HomeExplorer';
import SimpleHero from '@/components/home/SimpleHero';
import type { SanityImageSource } from '@/lib/sanity';
import {
  getAllGalleryImages,
  getAudioCollections,
  getBio,
  getPhotographyCollections,
  getVisualCollections,
  urlForImage,
} from '@/lib/sanity';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sortByOrder<T extends { order?: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

/** Sanity list shape for home catalog (GROQ is untyped). */
interface CollectionListRow {
  _id: string;
  title: string;
  order?: number;
  imageCount?: number;
  mediaCount?: number;
  previewImage?: unknown;
}

function previewUrl(img: unknown): string | null {
  if (!img || typeof img !== 'object' || !('asset' in img)) return null;
  const asset = (img as { asset?: { _ref?: string } }).asset;
  if (!asset?._ref) return null;
  return urlForImage(img as SanityImageSource)
    .width(720)
    .height(900)
    .fit('crop')
    .auto('format')
    .quality(82)
    .url();
}

export default async function Home() {
  const [bio, galleryImages, photoCols, artCols, audioCols] = await Promise.all([
    getBio(),
    getAllGalleryImages(),
    getPhotographyCollections(),
    getVisualCollections(),
    getAudioCollections(),
  ]);

  const flatSources = shuffle<SanityImageSource>([
    ...(bio?.images ?? []),
    ...galleryImages,
  ]);

  const slides = flatSources.map((source, i) => ({
    src: urlForImage(source).width(1680).height(1050).fit('max').auto('format').quality(85).url(),
    alt: `Portfolio image ${i + 1}`,
  }));

  const initialSlideIndex =
    slides.length > 0 ? Math.floor(Math.random() * slides.length) : 0;

  const catalogTiles: CatalogTile[] = [
    ...sortByOrder(photoCols as CollectionListRow[]).map((c) => ({
      href: `/visual?type=photography&collection=${c._id}`,
      title: c.title,
      subtitle: `Photography · ${c.imageCount ?? 0} images`,
      imageSrc: previewUrl(c.previewImage),
    })),
    ...sortByOrder(artCols as CollectionListRow[]).map((c) => ({
      href: `/visual?type=visual&collection=${c._id}`,
      title: c.title,
      subtitle: `Artwork · ${c.imageCount ?? 0} images`,
      imageSrc: previewUrl(c.previewImage),
    })),
    ...sortByOrder(audioCols as CollectionListRow[]).map((c) => ({
      href: `/audio?collection=${c._id}`,
      title: c.title,
      subtitle: `Audio · ${c.mediaCount ?? 0} tracks`,
      imageSrc: previewUrl(c.previewImage),
    })),
  ];

  return (
    <div>
      <SimpleHero bio={bio} />
      <HomeExplorer
        slides={slides}
        initialSlideIndex={initialSlideIndex}
        catalogTiles={catalogTiles}
      />
    </div>
  );
}
