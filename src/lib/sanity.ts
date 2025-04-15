import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Define a type for Sanity image reference
interface SanityImageSource {
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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'z85vvbbq',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false, // During development, use false. For production, you can use true
});

// Helper function to build image URLs with the Sanity Image URL builder
const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource | string) {
  return builder.image(source);
}

// Fetch Bio Information
export async function getBio() {
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  return client.fetch(`*[_type == "bio"][0]{
    title,
    content,
    images
  }`, { timestamp }); // Pass timestamp as param to ensure fresh data
}

// Fetch all Photography collections
export async function getPhotographyCollections() {
  return client.fetch(`*[_type == "photography"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images)
  }`);
}

// Fetch a specific Photography collection with its images
export async function getPhotographyCollection(collectionId: string) {
  return client.fetch(`*[_type == "photography" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    images[] {
      _key,
      asset
    }
  }`, { id: collectionId });
}

// Fetch all Visual Art collections
export async function getVisualCollections() {
  return client.fetch(`*[_type == "visual"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images)
  }`);
}

// Fetch a specific Visual Art collection with its images
export async function getVisualCollection(collectionId: string) {
  return client.fetch(`*[_type == "visual" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    images[] {
      _key,
      asset
    }
  }`, { id: collectionId });
}

// Fetch Audio
export async function getAudio({ limit = 10, skip = 0 } = {}) {
  return client.fetch(`*[_type == "audio"] | order(year desc) [${skip}...${skip + limit}]{
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
  }`);
}

// Fetch Audio Collections
export async function getAudioCollections() {
  return client.fetch(`*[_type == "audio"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "mediaCount": count(tracks)
  }`);
}

// Fetch a specific Audio Collection with its tracks
export async function getAudioCollection(collectionId: string) {
  return client.fetch(`*[_type == "audio" && _id == $id][0]{
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
  }`, { id: collectionId });
}

// Fetch Visual Items (combined visual and photography with category filtering)
export async function getVisualItems({ 
  limit = 50, 
  skip = 0, 
  type = 'all',
  category = undefined 
}: {
  limit?: number;
  skip?: number;
  type?: string;
  category?: string | null | undefined;
} = {}) {
  let query = '';
  
  if (type === 'visual') {
    if (category) {
      // Fetch visual with specific category
      query = `*[_type == "visual" && category == "${category}"] | order(year desc) [${skip}...${skip + limit}]`;
    } else {
      // Fetch all visual
      query = `*[_type == "visual"] | order(year desc) [${skip}...${skip + limit}]`;
    }
  } else if (type === 'photography') {
    if (category) {
      // Fetch photography with specific category
      query = `*[_type == "photography" && category == "${category}"] | order(year desc) [${skip}...${skip + limit}]`;
    } else {
      // Fetch all photography
      query = `*[_type == "photography"] | order(year desc) [${skip}...${skip + limit}]`;
    }
  } else {
    // Combined query for both visual and photography
    query = `*[_type in ["visual", "photography"]] | order(year desc) [${skip}...${skip + limit}]`;
  }
  
  return client.fetch(query);
}

// Fetch categories
export async function getCategories() {
  return client.fetch(`*[_type == "category"] | order(title asc){
    _id,
    title,
    slug,
    description,
    color,
  }`);
} 