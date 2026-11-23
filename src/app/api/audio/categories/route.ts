import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { audioCategoriesQuery } from '@/lib/sanity.queries';

export async function GET() {
  try {
    // Fetch audio categories from Sanity
    const categories = await fetchAudioCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching audio categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio categories' },
      { status: 500 }
    );
  }
}

// Helper function to fetch audio categories
async function fetchAudioCategories() {
  // Query for distinct categories used in audio documents
  // This will dynamically fetch categories that actually exist in your content
  const result = await client.fetch(audioCategoriesQuery);

  // Map the raw categories to the expected format
  const categories = (result ?? []).map((category: string) => ({
    _id: category,
    title: category.charAt(0).toUpperCase() + category.slice(1),
    slug: { current: category },
  }));

  // If no categories are found, return default "Music" category
  if (categories.length === 0) {
    return [{ _id: 'music', title: 'Music', slug: { current: 'music' } }];
  }

  return categories;
} 