import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

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
  const result = await client.fetch(`
    *[_type == "audio" && defined(category)] {
      "category": category
    } | order(category) | unique(category)
  `);

  // Map the raw categories to the expected format
  const categories = result.map((item: { category: string }) => ({
    _id: item.category,
    title: item.category.charAt(0).toUpperCase() + item.category.slice(1), // Capitalize first letter
    slug: { current: item.category }
  }));

  // If no categories are found, return default "Music" category
  if (categories.length === 0) {
    return [{ _id: 'music', title: 'Music', slug: { current: 'music' } }];
  }

  return categories;
} 