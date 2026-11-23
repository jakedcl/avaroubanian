import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SITE_DEFAULTS } from '@/lib/site-defaults';
import { sanityApiVersion, sanityDataset, sanityProjectId } from '@/lib/sanity-env';
import {
  allGalleryAudioCoversQuery,
  allGalleryPhotoVisualQuery,
  audioCollectionCountQuery,
  audioCollectionQuery,
  audioCollectionsQuery,
  audioListQuery,
  categoriesQuery,
  legacyBioQuery,
  photographyCollectionQuery,
  photographyCollectionsQuery,
  siteSettingsQuery,
  visualCollectionQuery,
  visualCollectionsQuery,
  visualItemsQuery,
} from '@/lib/sanity.queries';

// Define a type for Sanity image reference
export interface SanityImageSource {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
  crop?: {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  hotspot?: {
    height?: number;
    width?: number;
    x?: number;
    y?: number;
  };
}

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
});

const fetchOptions = { next: { tags: ['sanity'] } };

// Helper function to build image URLs with the Sanity Image URL builder
const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImageSource | string) {
  return builder.image(source);
}

export type SiteSettings = {
  contactEmail: string;
  instagramUrl: string;
  bioTitle: string;
  bioContent?: unknown;
  bioImages?: SanityImageSource[];
  bioContentPlain: string;
};

function isSanityImageSource(image: unknown): image is SanityImageSource {
  if (typeof image !== 'object' || image === null) return false;
  const asset = (image as SanityImageSource).asset;
  return typeof asset?._ref === 'string' && typeof asset._type === 'string';
}

function normalizeBioImages(images: unknown): SanityImageSource[] {
  if (!Array.isArray(images)) return [];
  return images.filter(isSanityImageSource);
}

type RawSiteSettings = {
  contactEmail?: string | null;
  instagramUrl?: string | null;
  bioTitle?: string | null;
  bioContent?: unknown;
  bioImages?: unknown;
  bioContentPlain?: string | null;
};

function resolveSiteSettings(raw: RawSiteSettings | null): SiteSettings {
  const bioContentPlain =
    raw?.bioContentPlain?.trim() || SITE_DEFAULTS.bioContentPlain;

  return {
    contactEmail: raw?.contactEmail?.trim() || SITE_DEFAULTS.contactEmail,
    instagramUrl: raw?.instagramUrl?.trim() || SITE_DEFAULTS.instagramUrl,
    bioTitle: raw?.bioTitle?.trim() || SITE_DEFAULTS.bioTitle,
    bioContent: raw?.bioContent,
    bioImages: normalizeBioImages(raw?.bioImages),
    bioContentPlain,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await client.fetch(
    siteSettingsQuery,
    {},
    fetchOptions,
  );

  if (settings?.bioContentPlain?.trim() || settings?.bioContent) {
    return resolveSiteSettings(settings);
  }

  const legacyBio = await client.fetch(legacyBioQuery, {}, fetchOptions);

  if (legacyBio) {
    return resolveSiteSettings({
      contactEmail: settings?.contactEmail,
      instagramUrl: settings?.instagramUrl,
      bioTitle: settings?.bioTitle ?? legacyBio.title,
      bioContent: settings?.bioContent ?? legacyBio.content,
      bioImages: normalizeBioImages(settings?.bioImages ?? legacyBio.images),
      bioContentPlain: settings?.bioContentPlain || legacyBio.contentPlain,
    });
  }

  return resolveSiteSettings(settings);
}

// Fetch Bio Information (home page)
export async function getBio() {
  const settings = await getSiteSettings();
  return {
    title: settings.bioTitle,
    content: settings.bioContent,
    contentPlain: settings.bioContentPlain,
    images: settings.bioImages,
  };
}

/** All images from photography, artwork (visual), and audio track covers — shuffled once. */
export async function getAllGalleryImages(): Promise<SanityImageSource[]> {
  const [photoVisual, audioCovers] = await Promise.all([
    client.fetch(allGalleryPhotoVisualQuery, {}, fetchOptions),
    client.fetch(allGalleryAudioCoversQuery, {}, fetchOptions),
  ]);

  const flat: SanityImageSource[] = [];
  for (const row of photoVisual) {
    for (const image of row.images ?? []) {
      if (isSanityImageSource(image)) flat.push(image);
    }
  }
  for (const doc of audioCovers) {
    for (const t of doc.tracks ?? []) {
      if (t.coverImage && isSanityImageSource(t.coverImage)) {
        flat.push(t.coverImage);
      }
    }
  }

  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }

  return flat;
}

/** @deprecated Use {@link getAllGalleryImages} */
export const getFilmstripImages = getAllGalleryImages;

// Fetch all Photography collections
export async function getPhotographyCollections() {
  return client.fetch(photographyCollectionsQuery, {}, fetchOptions);
}

// Fetch a specific Photography collection with its images
export async function getPhotographyCollection(collectionId: string) {
  return client.fetch(
    photographyCollectionQuery,
    { id: collectionId },
    fetchOptions,
  );
}

// Fetch all Visual Art collections
export async function getVisualCollections() {
  return client.fetch(visualCollectionsQuery, {}, fetchOptions);
}

// Fetch a specific Visual Art collection with its images
export async function getVisualCollection(collectionId: string) {
  return client.fetch(
    visualCollectionQuery,
    { id: collectionId },
    fetchOptions,
  );
}

// Fetch Audio
export async function getAudio({ limit = 10, skip = 0 } = {}) {
  return client.fetch(
    audioListQuery,
    { skip, end: skip + limit },
    fetchOptions,
  );
}

// Fetch Audio Collections
export async function getAudioCollections() {
  return client.fetch(audioCollectionsQuery, {}, fetchOptions);
}

/** Number of audio collections that have at least one track. Used to hide Audio when empty. */
export async function getAudioCollectionCount(): Promise<number> {
  const n = await client.fetch(audioCollectionCountQuery, {}, fetchOptions);
  return typeof n === 'number' ? n : 0;
}

// Fetch a specific Audio Collection with its tracks
export async function getAudioCollection(collectionId: string) {
  return client.fetch(
    audioCollectionQuery,
    { id: collectionId },
    fetchOptions,
  );
}

// Fetch Visual Items (combined visual and photography with category filtering)
export async function getVisualItems({
  limit = 50,
  skip = 0,
  type = 'all',
  category = undefined,
}: {
  limit?: number;
  skip?: number;
  type?: string;
  category?: string | null | undefined;
} = {}) {
  const types =
    type === 'visual'
      ? ['visual']
      : type === 'photography'
        ? ['photography']
        : ['visual', 'photography'];

  return client.fetch(
    visualItemsQuery,
  {
      types,
      category: category ?? null,
      skip,
      end: skip + limit,
    },
    fetchOptions,
  );
}

// Fetch categories
export async function getCategories() {
  return client.fetch(categoriesQuery, {}, fetchOptions);
}