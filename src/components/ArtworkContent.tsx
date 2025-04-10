'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';
import ImageModal from './ImageModal';

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

export default function ArtworkContent() {
  // Collections state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  
  // Loading states
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Fetch collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoadingCollections(true);
        
        // Fetch collections for artwork (visual)
        const response = await fetch(`/api/visual?type=visual`);
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
        console.error('Error fetching artwork collections:', error);
      } finally {
        setLoadingCollections(false);
      }
    }
    
    fetchCollections();
  }, [activeCollection]);
  
  // Fetch images when active collection changes
  useEffect(() => {
    async function fetchCollectionImages() {
      if (!activeCollection) return;
      
      try {
        setLoadingImages(true);
        
        // Fetch the active collection with its images
        const response = await fetch(`/api/visual?type=visual&collectionId=${activeCollection}`);
        const data = await response.json();
        
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
          setCollectionImages(imagesWithType);
        } else {
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
  }, [activeCollection]);
  
  // Checking if any collection is present to possibly select as default
  useEffect(() => {
    if (collections.length > 0 && !activeCollection) {
      setActiveCollection(collections[0]._id);
    }
  }, [collections, activeCollection]);

  // Open image modal with the clicked image
  const openImageModal = (index: number) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };
  
  // Close image modal
  const closeImageModal = () => {
    setIsModalOpen(false);
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
        {/* Collection Description - Removed as requested */}

        {/* Masonry grid - always visible */}
        {collections.length === 0 && !loadingCollections ? (
          // No collections at all - Show Coming Soon
          <div className="folder-empty flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 className="text-gray-800 text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-600 text-center max-w-md">Artwork collections are being prepared and will be available soon.</p>
          </div>
        ) : !activeCollection ? (
          // No collection selected
          <div className="folder-empty">
            <p className="text-gray-600">Select a collection tab to view its images.</p>
          </div>
        ) : collectionImages.length === 0 && !loadingImages ? (
          // Empty collection (only show when not loading)
          <div className="folder-empty">
            <p className="text-gray-600">No images found in this collection.</p>
          </div>
        ) : (
          // Masonry grid - true masonry with original image dimensions
          <div className="masonry-grid">
            {collectionImages.map((image, index) => (
              <div key={image._key} className="masonry-grid-item">
                <div 
                  className="relative overflow-hidden bg-white/10 w-full cursor-pointer group"
                  style={{ marginBottom: '8px' }}
                  onClick={() => openImageModal(index)}
                >
                  {/* Overlay with zoom icon on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </div>
                  
                  <Image
                    src={urlForImage(image)
                      // Keep original dimensions but set a maximum width for performance
                      .width(1200)
                      .url()}
                    alt=""
                    width={1200}
                    height={0}
                    priority={index === 0} // Load first image with priority
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      display: 'block', // Prevent extra space below image
                      maxWidth: '100%'
                    }}
                    sizes="(max-width: 480px) 95vw, (max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                    className="transition-transform duration-300 group-hover:scale-105"
                    unoptimized={false} // Use Next.js image optimization
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading overlay - only shown when loading images */}
        {loadingImages && (
          <div className="folder-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      <ImageModal
        images={collectionImages}
        initialIndex={activeImageIndex}
        isOpen={isModalOpen}
        onClose={closeImageModal}
      />
    </>
  );
} 