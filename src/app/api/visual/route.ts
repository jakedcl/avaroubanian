import { NextResponse } from 'next/server';
import { getVisualCollections, getVisualCollection, getPhotographyCollections, getPhotographyCollection } from '@/lib/sanity';

export async function GET(request: Request) {
  try {
    // Get the URL and search params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const collectionId = searchParams.get('collectionId');
    
    console.log(`API Request - type: ${type}, collectionId: ${collectionId || 'none'}`);
    
    // Handle different requests based on parameters
    if (type === 'photography') {
      if (collectionId) {
        // Fetch a specific photography collection with its images
        const collection = await getPhotographyCollection(collectionId);
        console.log('Photography collection fetched:', collection ? collection._id : 'not found');
        return NextResponse.json(collection);
      } else {
        // Fetch all photography collections
        const collections = await getPhotographyCollections();
        console.log(`Found ${collections.length} photography collections`);
        return NextResponse.json(collections);
      }
    } else if (type === 'visual') {
      if (collectionId) {
        // Fetch a specific visual collection with its images
        const collection = await getVisualCollection(collectionId);
        console.log('Visual collection fetched:', collection ? collection._id : 'not found');
        return NextResponse.json(collection);
      } else {
        // Fetch all visual collections
        const collections = await getVisualCollections();
        console.log(`Found ${collections.length} visual collections`);
        return NextResponse.json(collections);
      }
    } else {
      // Default: return both types of collections
      const [photoCollections, visualCollections] = await Promise.all([
        getPhotographyCollections(),
        getVisualCollections()
      ]);
      
      console.log(`Found ${photoCollections.length} photography collections and ${visualCollections.length} visual collections`);
      
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