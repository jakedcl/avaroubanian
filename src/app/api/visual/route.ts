import { NextResponse } from 'next/server';
import { getVisualCollections, getVisualCollection, getPhotographyCollections, getPhotographyCollection } from '@/lib/sanity';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const collectionId = searchParams.get('collectionId');

    if (type === 'photography') {
      if (collectionId) {
        const collection = await getPhotographyCollection(collectionId);
        return NextResponse.json(collection);
      } else {
        const collections = await getPhotographyCollections();
        return NextResponse.json(collections);
      }
    } else if (type === 'visual') {
      if (collectionId) {
        const collection = await getVisualCollection(collectionId);
        return NextResponse.json(collection);
      } else {
        const collections = await getVisualCollections();
        return NextResponse.json(collections);
      }
    } else {
      const [photoCollections, visualCollections] = await Promise.all([
        getPhotographyCollections(),
        getVisualCollections()
      ]);

      return NextResponse.json({
        photography: photoCollections,
        visual: visualCollections
      });
    }
  } catch (error) {
    console.error('Error fetching visual items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visual items' },
      { status: 500 }
    );
  }
} 