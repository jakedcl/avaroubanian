'use client';

import { useState, useEffect, useRef } from 'react';
import { urlForImage } from '@/lib/sanity';
import Image from 'next/image';

interface AudioCollection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  order?: number;
}

interface MediaItem {
  _key: string;
  title: string;
  year?: number;
  description?: string;
  mediaType: 'audio' | 'video';
  mediaFile: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  coverImage?: {
    asset: {
      _ref: string;
    };
  };
}

export default function AudioContent() {
  // Collections state
  const [collections, setCollections] = useState<AudioCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentMediaItem, setCurrentMediaItem] = useState<MediaItem | null>(null);
  
  // Loading states
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  
  // Media player refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoadingCollections(true);
        
        const response = await fetch(`/api/audio`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Sort collections by order if available
          const sortedCollections = [...data].sort((a, b) => 
            (a.order || 100) - (b.order || 100)
          );
          setCollections(sortedCollections);
          
          // Set the first collection as active if available
          if (sortedCollections.length > 0 && !activeCollection) {
            setActiveCollection(sortedCollections[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching audio collections:', error);
      } finally {
        setLoadingCollections(false);
      }
    }
    
    fetchCollections();
  }, []);
  
  // Fetch media items when active collection changes
  useEffect(() => {
    async function fetchCollectionMedia() {
      if (!activeCollection) return;
      
      try {
        setLoadingMedia(true);
        setCurrentMediaItem(null);
        
        // Fetch the active collection with its media items
        const response = await fetch(`/api/audio?collectionId=${activeCollection}`);
        const data = await response.json();
        
        if (data && data.tracks) {
          setMediaItems(data.tracks);
        } else {
          setMediaItems([]);
        }
      } catch (error) {
        console.error('Error fetching collection media:', error);
        setMediaItems([]);
      } finally {
        setLoadingMedia(false);
      }
    }
    
    fetchCollectionMedia();
  }, [activeCollection]);
  
  // Handle playing a media item
  const playMedia = (item: MediaItem) => {
    setCurrentMediaItem(item);
    
    // Give the DOM time to update with the new source
    setTimeout(() => {
      if (item.mediaType === 'audio' && audioRef.current) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      } else if (item.mediaType === 'video' && videoRef.current) {
        videoRef.current.play().catch(err => console.error('Error playing video:', err));
      }
    }, 100);
  };
  
  // Get collection title
  const getCollectionTitle = () => {
    const collection = collections.find(c => c._id === activeCollection);
    return collection?.title || 'Select a collection';
  };

  return (
    <>
      {/* Collection Side Tabs */}
      <div className="collection-tabs">
        {loadingCollections ? (
          <div className="py-2 px-4">
            <div className="loading-spinner collection-loading-spinner"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-2 px-4 text-gray-800">
            {/* Empty state - no need for collection tabs */}
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection._id}
              className={`collection-tab ${activeCollection === collection._id ? 'active' : ''}`}
              onClick={() => setActiveCollection(collection._id)}
            >
              {collection.title}
            </div>
          ))
        )}
      </div>

      {/* Folder Content */}
      <div className="folder-content">
        {/* Collection Description (optional) */}
        {activeCollection && !loadingMedia && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{getCollectionTitle()}</h2>
            {collections.find(c => c._id === activeCollection)?.description && (
              <p className="text-gray-600 mt-1">
                {collections.find(c => c._id === activeCollection)?.description}
              </p>
            )}
          </div>
        )}

        {/* Media Player (if item is selected) */}
        {currentMediaItem && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Cover Image Column */}
              {currentMediaItem.coverImage && (
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <div className="relative aspect-square">
                    <Image 
                      src={urlForImage({
                        ...currentMediaItem.coverImage,
                        _type: 'image',
                        asset: {
                          ...currentMediaItem.coverImage.asset,
                          _type: 'reference'
                        }
                      }).width(400).height(400).url()}
                      alt={currentMediaItem.title}
                      className="rounded-md object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                </div>
              )}
              
              {/* Media Player Column */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{currentMediaItem.title}</h3>
                {currentMediaItem.year && (
                  <p className="text-gray-500 text-sm mb-2">Year: {currentMediaItem.year}</p>
                )}
                {currentMediaItem.description && (
                  <p className="text-gray-600 text-sm mb-3">{currentMediaItem.description}</p>
                )}
                
                {/* Media Player */}
                <div className="mt-2 w-full">
                  {currentMediaItem.mediaType === 'audio' ? (
                    <audio 
                      ref={audioRef} 
                      controls 
                      className="w-full"
                      src={currentMediaItem.mediaFile.asset.url}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <video
                      ref={videoRef}
                      controls
                      className="w-full rounded-md"
                      src={currentMediaItem.mediaFile.asset.url}
                    >
                      Your browser does not support the video element.
                    </video>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Items List */}
        {collections.length === 0 && !loadingCollections ? (
          // No collections at all - Show Coming Soon
          <div className="folder-empty flex flex-col items-center justify-center py-16">
            <h2 className="text-gray-800 text-center font-large max-w-md">Coming soon!</h2>
          </div>
        ) : !activeCollection ? (
          // No collection selected
          <div className="folder-empty">
            <p className="text-gray-600">Select a collection tab to view its media.</p>
          </div>
        ) : mediaItems.length === 0 && !loadingMedia ? (
          // Empty collection (only show when not loading)
          <div className="folder-empty">
            <p className="text-gray-600">No media items found in this collection.</p>
          </div>
        ) : (
          // Media items grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {mediaItems.map((item) => (
              <div 
                key={item._key} 
                className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  currentMediaItem?._key === item._key 
                    ? 'bg-gray-200 shadow-md' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => playMedia(item)}
              >
                <div className="flex items-center gap-3">
                  {/* Media Type Icon or Cover Image */}
                  {item.coverImage ? (
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={urlForImage({
                          ...item.coverImage,
                          _type: 'image',
                          asset: {
                            ...item.coverImage.asset,
                            _type: 'reference'
                          }
                        }).width(100).height(100).url()}
                        alt={item.title}
                        className="rounded-md object-cover"
                        fill
                        sizes="64px"
                      />
                      {/* Media Type Indicator */}
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        {item.mediaType === 'video' ? (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4h12v12H4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      {item.mediaType === 'video' ? (
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                      )}
                    </div>
                  )}
                  
                  {/* Item Info */}
                  <div className="overflow-hidden">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex text-sm text-gray-500 gap-2">
                      {item.year && <span>{item.year}</span>}
                      <span className="capitalize">{item.mediaType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading overlay - only shown when loading media */}
        {loadingMedia && (
          <div className="folder-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </>
  );
} 