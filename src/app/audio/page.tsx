'use client';

import { useState, useEffect, useRef } from 'react';
import { urlForImage } from '@/lib/sanity';

interface AudioCategory {
  _id: string;
  title: string;
  slug: { current: string };
}

interface AudioCollection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  order?: number;
}

interface AudioTrack {
  _key: string;
  title: string;
  audioFile: {
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
  description?: string;
}

export default function AudioPage() {
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Categories state
  const [categories, setCategories] = useState<AudioCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [containerVisible, setContainerVisible] = useState(false);
  
  // Collections state
  const [collections, setCollections] = useState<AudioCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionTracks, setCollectionTracks] = useState<AudioTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
  
  // Audio player ref
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Animate portfolio entrance when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setContainerVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch audio categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        
        // Fetch audio categories from Sanity
        const response = await fetch('/api/audio/categories');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          // Set the first category as active
          setActiveCategory(data[0]._id);
        } else {
          // If no categories returned, use a default
          setCategories([{ _id: 'music', title: 'Music', slug: { current: 'music' } }]);
          setActiveCategory('music');
        }
      } catch (error) {
        console.error('Error fetching audio categories:', error);
        // Use default category on error
        setCategories([{ _id: 'music', title: 'Music', slug: { current: 'music' } }]);
        setActiveCategory('music');
      } finally {
        setLoadingCategories(false);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Fetch collections based on the active category
  useEffect(() => {
    async function fetchCollections() {
      if (!activeCategory) return;
      
      try {
        setLoadingCollections(true);
        
        // Fetch collections for the active category
        const response = await fetch(`/api/audio?type=${activeCategory}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Sort collections by order if available
          const sortedCollections = [...data].sort((a, b) => 
            (a.order || 100) - (b.order || 100)
          );
          setCollections(sortedCollections);
          
          // Set the first collection as active if available
          if (sortedCollections.length > 0) {
            setActiveCollection(sortedCollections[0]._id);
          } else {
            setActiveCollection(null);
          }
        } else {
          setCollections([]);
          setActiveCollection(null);
        }
      } catch (error) {
        console.error(`Error fetching collections for category: ${activeCategory}`, error);
        setCollections([]);
        setActiveCollection(null);
      } finally {
        setLoadingCollections(false);
      }
    }
    
    fetchCollections();
  }, [activeCategory]);
  
  // Fetch tracks when active collection changes
  useEffect(() => {
    async function fetchCollectionTracks() {
      if (!activeCollection) return;
      
      try {
        setLoadingTracks(true);
        
        // Fetch the active collection with its tracks
        const response = await fetch(`/api/audio?type=${activeCategory}&collectionId=${activeCollection}`);
        const data = await response.json();
        
        if (data && data.tracks) {
          setCollectionTracks(data.tracks);
          // Reset the current track when collection changes
          setCurrentTrack(null);
        } else {
          setCollectionTracks([]);
        }
      } catch (error) {
        console.error('Error fetching collection tracks:', error);
        setCollectionTracks([]);
      } finally {
        setLoadingTracks(false);
      }
    }
    
    fetchCollectionTracks();
  }, [activeCategory, activeCollection]);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveCollection(null);
    setCurrentTrack(null);
    
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Play a track
  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    // Play audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
    }, 100);
  };
  
  // Get current collection title
  const getCurrentCollectionTitle = () => {
    const collection = collections.find(c => c._id === activeCollection);
    return collection?.title || 'Select a collection';
  };

  // Get tab color for each collection - distribute colors evenly
  const getTabColor = (index: number) => {
    const colorCount = 10; // We have 10 colors defined
    return `tab-color-${(index % colorCount) + 1}`;
  };

  return (
    <div className="py-6">
      {/* Combined Portfolio Container (tabs + folder) */}
      <div 
        ref={containerRef}
        className={`portfolio-container ${containerVisible ? 'visible' : ''} max-w-7xl mx-auto`}
      >
        {/* Main Category Tabs - Dynamically generated */}
        <div className="main-tabs-container">
          {loadingCategories ? (
            <div className="main-tab">Loading...</div>
          ) : (
            categories.map(category => (
              <div
                key={category._id}
                className={`main-tab ${activeCategory === category._id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.title}
              </div>
            ))
          )}
        </div>

        {/* Portfolio Folder */}
        <div className="portfolio-folder">
          {/* Collection Side Tabs */}
          <div className="collection-tabs">
            {loadingCollections ? (
              <div className="py-2 px-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800 inline-block mr-2"></div>
                <span className="text-gray-800">Loading collections...</span>
              </div>
            ) : collections.length === 0 ? (
              <div className="py-2 px-4 text-gray-800">
                No collections found
              </div>
            ) : (
              collections.map((collection, index) => (
                <div
                  key={collection._id}
                  className={`collection-tab ${getTabColor(index)} ${activeCollection === collection._id ? 'active' : ''}`}
                  onClick={() => setActiveCollection(collection._id)}
                >
                  {collection.title}
                </div>
              ))
            )}
          </div>

          {/* Folder Content */}
          <div className="folder-content">
            {/* Collection Title */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{getCurrentCollectionTitle()}</h2>
              {activeCollection && (
                <p className="text-gray-600 mt-1">
                  {collections.find(c => c._id === activeCollection)?.description || ''}
                </p>
              )}
            </div>

            {/* Audio Player (if track is selected) */}
            {currentTrack && (
              <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {currentTrack.coverImage && (
                    <div className="w-32 h-32 relative">
                      <img 
                        src={urlForImage({
                          ...currentTrack.coverImage,
                          _type: 'image',
                          asset: {
                            ...currentTrack.coverImage.asset,
                            _type: 'reference'
                          }
                        }).width(200).height(200).url()}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{currentTrack.title}</h3>
                    {currentTrack.description && (
                      <p className="text-gray-600 text-sm mt-1">{currentTrack.description}</p>
                    )}
                    <div className="mt-3">
                      <audio 
                        ref={audioRef} 
                        controls 
                        className="w-full"
                        src={currentTrack.audioFile.asset.url}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracks List */}
            {loadingTracks ? (
              // Loading state
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div>
            ) : !activeCollection ? (
              // No collection selected
              <div className="text-center py-12">
                <p className="text-gray-600">Select a collection tab to view its tracks.</p>
              </div>
            ) : collectionTracks.length === 0 ? (
              // Empty collection
              <div className="text-center py-12">
                <p className="text-gray-600">No tracks found in this collection.</p>
              </div>
            ) : (
              // Tracks grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collectionTracks.map((track) => (
                  <div 
                    key={track._key} 
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      currentTrack?._key === track._key 
                        ? 'bg-gray-200' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex items-center gap-3">
                      {track.coverImage ? (
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <img
                            src={urlForImage({
                              ...track.coverImage,
                              _type: 'image',
                              asset: {
                                ...track.coverImage.asset,
                                _type: 'reference'
                              }
                            }).width(100).height(100).url()}
                            alt={track.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{track.title}</h3>
                        {track.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{track.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 