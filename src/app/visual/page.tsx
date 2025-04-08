'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';

interface Collection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  imageCount: number;
  order?: number;
}

interface CollectionImage {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

export default function VisualPage() {
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Main tabs state
  const [activeTab, setActiveTab] = useState<'photography' | 'visual'>('photography');
  const [containerVisible, setContainerVisible] = useState(false);
  
  // Collections state
  const [photoCollections, setPhotoCollections] = useState<Collection[]>([]);
  const [visualCollections, setVisualCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  
  // Loading states
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  
  // Animate portfolio entrance when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setContainerVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch collections based on the active tab
  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoadingCollections(true);
        
        console.log(`Fetching collections for tab: ${activeTab}`);
        
        // Fetch collections for the active tab
        const response = await fetch(`/api/visual?type=${activeTab}`);
        const data = await response.json();
        
        console.log(`Collections data received:`, data);
        
        if (Array.isArray(data)) {
          if (activeTab === 'photography') {
            console.log(`Setting ${data.length} photography collections`);
            // Sort collections by order if available
            const sortedCollections = [...data].sort((a, b) => 
              (a.order || 100) - (b.order || 100)
            );
            setPhotoCollections(sortedCollections);
            // Set the first collection as active if available and no active collection
            if (sortedCollections.length > 0 && !activeCollection) {
              console.log(`Setting active collection to: ${sortedCollections[0]._id}`);
              setActiveCollection(sortedCollections[0]._id);
            }
          } else {
            console.log(`Setting ${data.length} visual collections`);
            // Sort collections by order if available
            const sortedCollections = [...data].sort((a, b) => 
              (a.order || 100) - (b.order || 100)
            );
            setVisualCollections(sortedCollections);
            // Set the first collection as active if available and no active collection
            if (sortedCollections.length > 0 && !activeCollection) {
              console.log(`Setting active collection to: ${sortedCollections[0]._id}`);
              setActiveCollection(sortedCollections[0]._id);
            }
          }
        } else {
          console.log(`Received non-array data:`, data);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} collections:`, error);
      } finally {
        setLoadingCollections(false);
      }
    }
    
    fetchCollections();
  }, [activeTab]);
  
  // Fetch images when active collection changes
  useEffect(() => {
    async function fetchCollectionImages() {
      if (!activeCollection) return;
      
      try {
        setLoadingImages(true);
        
        console.log(`Fetching images for collection: ${activeCollection} (${activeTab})`);
        
        // Fetch the active collection with its images
        const response = await fetch(`/api/visual?type=${activeTab}&collectionId=${activeCollection}`);
        const data = await response.json();
        
        console.log(`Collection images data:`, data);
        
        if (data && data.images) {
          // Add required _type property for sanity urlForImage
          const imagesWithType = data.images.map((img: CollectionImage) => ({
            ...img,
            _type: 'image',
            asset: {
              ...img.asset,
              _type: 'reference'
            }
          }));
          console.log(`Setting ${imagesWithType.length} images for collection`);
          setCollectionImages(imagesWithType);
        } else {
          console.log(`No images found in collection data`);
          setCollectionImages([]);
        }
      } catch (error) {
        console.error('Error fetching collection images:', error);
        setCollectionImages([]);
      } finally {
        setLoadingImages(false);
      }
    }
    
    fetchCollectionImages();
  }, [activeTab, activeCollection]);
  
  // Handle tab change
  const handleTabChange = (tab: 'photography' | 'visual') => {
    setActiveTab(tab);
    setActiveCollection(null);
  };
  
  // Get current collections based on active tab
  const currentCollections = activeTab === 'photography' ? photoCollections : visualCollections;
  
  // Get current collection title
  const getCurrentCollectionTitle = () => {
    const collection = currentCollections.find(c => c._id === activeCollection);
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
        {/* Main Tabs (Photography/Artwork) */}
        <div className="main-tabs-container">
          <div
            className={`main-tab ${activeTab === 'photography' ? 'active' : ''}`}
            onClick={() => handleTabChange('photography')}
          >
            Photography
          </div>
          <div
            className={`main-tab ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => handleTabChange('visual')}
          >
            Artwork
          </div>
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
            ) : currentCollections.length === 0 ? (
              <div className="py-2 px-4 text-gray-800">
                No collections found
              </div>
            ) : (
              currentCollections.map((collection, index) => (
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
                  {currentCollections.find(c => c._id === activeCollection)?.description || ''}
                </p>
              )}
            </div>

            {/* Gallery - Masonry Grid */}
            {loadingImages ? (
              // Loading state
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div>
            ) : !activeCollection ? (
              // No collection selected
              <div className="text-center py-12">
                <p className="text-gray-600">Select a collection tab to view its images.</p>
              </div>
            ) : collectionImages.length === 0 ? (
              // Empty collection
              <div className="text-center py-12">
                <p className="text-gray-600">No images found in this collection.</p>
              </div>
            ) : (
              // Masonry grid - true masonry with original image dimensions
              <div className="masonry-grid">
                {collectionImages.map((image) => (
                  <div key={image._key} className="masonry-grid-item">
                    <div 
                      className="relative overflow-hidden bg-white/10 w-full"
                      style={{ marginBottom: '8px' }}
                    >
                      <Image
                        src={urlForImage(image)
                          // Keep original dimensions but set a maximum width for performance
                          .width(2000)
                          .url()}
                        alt=""
                        width={2000}
                        height={0}
                        style={{ width: '100%', height: 'auto' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="hover:scale-105 transition-transform duration-300"
                      />
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