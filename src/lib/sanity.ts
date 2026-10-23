import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SITE_DEFAULTS } from '@/lib/site-defaults';

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

export type SanityImageWithMeta = SanityImageSource & {
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  lqip?: string | null;
};

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'z85vvbbq',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

const fetchOptions = { next: { tags: ['sanity'] } };

// Helper function to build image URLs with the Sanity Image URL builder
const builder = imageUrlBuilder(client);

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

type RawSiteSettings = {
  contactEmail?: string | null;
  instagramUrl?: string | null;
  bioTitle?: string | null;
  bioContent?: unknown;
  bioImages?: SanityImageSource[];
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
    bioImages: raw?.bioImages ?? [],
    bioContentPlain,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await client.fetch<RawSiteSettings | null>(
    `*[_type == "siteSettings"][0]{
      contactEmail,
      instagramUrl,
      bioTitle,
      bioContent,
      bioImages,
      "bioContentPlain": coalesce(pt::text(bioContent), "")
    }`,
    {},
    fetchOptions,
  );

  if (settings?.bioContentPlain?.trim() || settings?.bioContent) {
    return resolveSiteSettings(settings);
  }

  const legacyBio = await client.fetch<{
    title?: string | null;
    content?: unknown;
    images?: SanityImageSource[];
    contentPlain?: string | null;
  } | null>(
    `*[_type == "bio"][0]{
      title,
      content,
      images,
      "contentPlain": coalesce(pt::text(content), "")
    }`,
    {},
    fetchOptions,
  );

  if (legacyBio) {
    return resolveSiteSettings({
      contactEmail: settings?.contactEmail,
      instagramUrl: settings?.instagramUrl,
      bioTitle: settings?.bioTitle ?? legacyBio.title,
      bioContent: settings?.bioContent ?? legacyBio.content,
      bioImages: settings?.bioImages ?? legacyBio.images,
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

const IMAGE_WITH_META = `{..., "dimensions": asset->metadata.dimensions{width, height, aspectRatio}, "lqip": asset->metadata.lqip}`;

/** Home hero: first Site settings home image, else first image of the first Photography collection. */
export async function getHomeHeroImage(): Promise<SanityImageWithMeta | null> {
  const fromSettings = await client.fetch<SanityImageWithMeta | null>(
    `*[_type == "siteSettings"][0].bioImages[0]${IMAGE_WITH_META}`,
    {},
    fetchOptions,
  );
  if (fromSettings?.asset?._ref) return fromSettings;

  const fromPhotography = await client.fetch<SanityImageWithMeta | null>(
    `*[_type == "photography"] | order(order asc, title asc)[0].images[0]${IMAGE_WITH_META}`,
    {},
    fetchOptions,
  );
  return fromPhotography?.asset?._ref ? fromPhotography : null;
}

/** All images from photography, artwork (visual), and audio track covers — shuffled once. */
export async function getAllGalleryImages(): Promise<SanityImageSource[]> {
  const [photoVisual, audioCovers] = await Promise.all([
    client.fetch<{ images?: SanityImageSource[] }[]>(
      `*[_type in ["photography", "visual"]]{ images }`,
      {},
      fetchOptions,
    ),
    client.fetch<{ tracks?: { coverImage?: SanityImageSource }[] }[]>(
      `*[_type == "audio"]{ tracks[]{ coverImage } }`,
      {},
      fetchOptions,
    ),
  ]);

  const flat: SanityImageSource[] = [];
  for (const row of photoVisual) {
    if (row.images?.length) flat.push(...row.images);
  }
  for (const doc of audioCovers) {
    for (const t of doc.tracks ?? []) {
      if (t.coverImage?.asset) flat.push(t.coverImage);
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
  return client.fetch(
    `*[_type == "photography"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images),
    "previewImage": images[0]{..., "lqip": asset->metadata.lqip}
  }`,
    {},
    fetchOptions,
  );
}

// Fetch a specific Photography collection with its images
export async function getPhotographyCollection(collectionId: string) {
  return client.fetch(
    `*[_type == "photography" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    images[] {
      _key,
      asset,
      "dimensions": asset->metadata.dimensions{width, height, aspectRatio},
      "lqip": asset->metadata.lqip
    }
  }`,
    { id: collectionId },
    fetchOptions,
  );
}

// Fetch all Visual Art collections
export async function getVisualCollections() {
  return client.fetch(
    `*[_type == "visual"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images),
    "previewImage": images[0]{..., "lqip": asset->metadata.lqip}
  }`,
    {},
    fetchOptions,
  );
}

// Fetch a specific Visual Art collection with its images
export async function getVisualCollection(collectionId: string) {
  return client.fetch(
    `*[_type == "visual" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    images[] {
      _key,
      asset,
      "dimensions": asset->metadata.dimensions{width, height, aspectRatio},
      "lqip": asset->metadata.lqip
    }
  }`,
    { id: collectionId },
    fetchOptions,
  );
}

// Fetch Audio
export async function getAudio({ limit = 10, skip = 0 } = {}) {
  return client.fetch(
    `*[_type == "audio"] | order(year desc) [${skip}...${skip + limit}]{
    _id,
    title,
    slug,
    coverImage,
    audioFile,
    description,
    year,
    videoUrl,
    credits,
    lyrics,
  }`,
    {},
    fetchOptions,
  );
}

// Fetch Audio Collections
export async function getAudioCollections() {
  return client.fetch(
    `*[_type == "audio"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "mediaCount": count(tracks),
    "previewImage": tracks[0].coverImage{..., "lqip": asset->metadata.lqip}
  }`,
    {},
    fetchOptions,
  );
}

/** Number of audio collections that have at least one track. Used to hide Audio when empty. */
export async function getAudioCollectionCount(): Promise<number> {
  const n = await client.fetch<number>(
    `count(*[_type == "audio" && count(tracks) > 0])`,
    {},
    fetchOptions,
  );
  return typeof n === 'number' ? n : 0;
}

// Fetch a specific Audio Collection with its tracks
export async function getAudioCollection(collectionId: string) {
  return client.fetch(
    `*[_type == "audio" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    tracks[] {
      _key,
      title,
      year,
      description,
      mediaType,
      coverImage,
      mediaFile {
        asset->{
          _ref,
          url
        }
      }
    }
  }`,
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
  let query = '';

  if (type === 'visual') {
    if (category) {
      query = `*[_type == "visual" && category == "${category}"] | order(year desc) [${skip}...${skip + limit}]`;
    } else {
      query = `*[_type == "visual"] | order(year desc) [${skip}...${skip + limit}]`;
    }
  } else if (type === 'photography') {
    if (category) {
      query = `*[_type == "photography" && category == "${category}"] | order(year desc) [${skip}...${skip + limit}]`;
    } else {
      query = `*[_type == "photography"] | order(year desc) [${skip}...${skip + limit}]`;
    }
  } else {
    query = `*[_type in ["visual", "photography"]] | order(year desc) [${skip}...${skip + limit}]`;
  }

  return client.fetch(query, {}, fetchOptions);
}

// Fetch categories
export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(title asc){
    _id,
    title,
    slug,
    description,
    color,
  }`,
    {},
    fetchOptions,
  );
}
