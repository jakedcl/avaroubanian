import { NextResponse } from 'next/server';
import { getAudioCollections, getAudioCollection } from '@/lib/sanity';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');

    if (collectionId) {
      const collection = await getAudioCollection(collectionId);
      return NextResponse.json(collection);
    } else {
      const collections = await getAudioCollections();
      return NextResponse.json(collections);
    }
  } catch (error) {
    console.error('Error fetching audio data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio data' },
      { status: 500 }
    );
  }
} 