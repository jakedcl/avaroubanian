import { NextResponse } from 'next/server';
import { getAudioCollections, getAudioCollection } from '@/lib/sanity';

export async function GET(request: Request) {
  try {
    // Get the URL and search params
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');
    
    console.log(`Audio API Request - collectionId: ${collectionId || 'none'}`);
    
    // Handle different requests based on parameters
    if (collectionId) {
      // Fetch a specific collection with its tracks
      const collection = await getAudioCollection(collectionId);
      console.log(`Audio collection fetched:`, collection ? collection._id : 'not found');
      return NextResponse.json(collection);
    } else {
      // Fetch all audio collections
      const collections = await getAudioCollections();
      console.log(`Found ${collections.length} audio collections`);
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