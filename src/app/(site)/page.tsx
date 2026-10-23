import HomeExplorer, { type CatalogTile, type HomeHero } from '@/components/home/HomeExplorer';
import Reveal from '@/components/Reveal';
import SimpleHero from '@/components/home/SimpleHero';
import type { SanityImageWithMeta } from '@/lib/sanity';
import {
  getAudioCollections,
  getBio,
  getHomeHeroImage,
  getPhotographyCollections,
  getVisualCollections,
  urlForImage,
} from '@/lib/sanity';

function sortByOrder<T extends { order?: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

/** Sanity list shape for home categories (GROQ is untyped). */
interface CollectionListRow {
  _id: string;
  title: string;
  order?: number;
  previewImage?: SanityImageWithMeta | null;
}

function tileSrc(img: SanityImageWithMeta | null | undefined): string | null {
  if (!img?.asset?._ref) return null;
  return urlForImage(img)
    .width(1200)
    .height(1500)
    .fit('crop')
    .auto('format')
    .quality(82)
    .url();
}

function toTiles(rows: CollectionListRow[], kind: string, hrefFor: (id: string) => string): CatalogTile[] {
  return sortByOrder(rows).map((c) => ({
    href: hrefFor(c._id),
    title: c.title,
    kind,
    imageSrc: tileSrc(c.previewImage),
    lqip: c.previewImage?.lqip ?? null,
  }));
}

export default async function Home() {
  const [bio, heroImage, photoCols, artCols, audioCols] = await Promise.all([
    getBio(),
    getHomeHeroImage(),
    getPhotographyCollections(),
    getVisualCollections(),
    getAudioCollections(),
  ]);

  const hero: HomeHero | null = heroImage
    ? {
        src: urlForImage(heroImage).width(2000).fit('max').auto('format').quality(85).url(),
        width: heroImage.dimensions?.width ?? 1600,
        height: heroImage.dimensions?.height ?? 1200,
        lqip: heroImage.lqip ?? null,
        alt: 'Work by Ava Roubanian',
      }
    : null;

  const catalogTiles: CatalogTile[] = [
    ...toTiles(photoCols as CollectionListRow[], 'Photography', (id) => `/visual?type=photography&collection=${id}`),
    ...toTiles(artCols as CollectionListRow[], 'Artwork', (id) => `/visual?type=visual&collection=${id}`),
    ...toTiles(audioCols as CollectionListRow[], 'Audio', (id) => `/audio?collection=${id}`),
  ];

  return (
    <HomeExplorer
      hero={hero}
      intro={
        <Reveal delay={150}>
          <SimpleHero bio={bio} />
        </Reveal>
      }
      catalogTiles={catalogTiles}
    />
  );
}
