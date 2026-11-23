import { defineQuery } from 'next-sanity';

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  contactEmail,
  instagramUrl,
  bioTitle,
  bioContent,
  bioImages,
  "bioContentPlain": coalesce(pt::text(bioContent), "")
}`);

export const legacyBioQuery = defineQuery(`*[_type == "bio"][0]{
  title,
  content,
  images,
  "contentPlain": coalesce(pt::text(content), "")
}`);

export const allGalleryPhotoVisualQuery = defineQuery(
  `*[_type in ["photography", "visual"]]{ images }`,
);

export const allGalleryAudioCoversQuery = defineQuery(
  `*[_type == "audio"]{ tracks[]{ coverImage } }`,
);

export const photographyCollectionsQuery = defineQuery(
  `*[_type == "photography"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images),
    "previewImage": images[0]{..., "lqip": asset->metadata.lqip}
  }`,
);

export const photographyCollectionQuery = defineQuery(
  `*[_type == "photography" && _id == $id][0]{
    _id,
    title,
    slug,
    description,
    images[] {
      _key,
      asset,
      alt,
      "dimensions": asset->metadata.dimensions{width, height, aspectRatio},
      "lqip": asset->metadata.lqip
    }
  }`,
);

export const visualCollectionsQuery = defineQuery(
  `*[_type == "visual"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "imageCount": count(images),
    "previewImage": images[0]{..., "lqip": asset->metadata.lqip}
  }`,
);

export const visualCollectionQuery = defineQuery(
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
);

export const audioListQuery = defineQuery(`*[_type == "audio"] | order(year desc) [$skip...$end]{
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

export const audioCollectionsQuery = defineQuery(
  `*[_type == "audio"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    order,
    "mediaCount": count(tracks),
    "previewImage": tracks[0].coverImage{..., "lqip": asset->metadata.lqip}
  }`,
);

export const audioCollectionCountQuery = defineQuery(
  `count(*[_type == "audio" && count(tracks) > 0])`,
);

export const audioCollectionQuery = defineQuery(
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
);

export const visualItemsQuery = defineQuery(
  `*[_type in $types && (!defined($category) || category == $category)] | order(year desc) [$skip...$end]`,
);

export const categoriesQuery = defineQuery(`*[_type == "category"] | order(title asc){
  _id,
  title,
  slug,
  description,
  color,
}`);

export const audioCategoriesQuery = defineQuery(
  `array::unique(*[_type == "audio" && defined(category)].category)`,
);