'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';

interface SanityImage {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface ImageModalProps {
  images: SanityImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ images, initialIndex, isOpen, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images?.length, onClose]);
  
  // Navigation function
  const navigate = (direction: 'prev' | 'next') => {
    if (!images || images.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };
  
  // If modal is closed or no images, don't render anything
  if (!isOpen || !images || images.length === 0) return null;
  
  // Get current image safely
  const currentImage = images[currentIndex];
  if (!currentImage) return null;
  
  console.log('Rendering modal with image:', currentImage);
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Navigation buttons */}
        <button
          className="absolute left-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            navigate('prev');
          }}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button
          className="absolute right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            navigate('next');
          }}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* Image */}
        <div className="relative max-h-[90vh] max-w-[90vw]">
          <Image
            src={urlForImage(currentImage)
              .width(1800)
              .url()}
            alt=""
            width={1800}
            height={1200}
            className="max-h-[90vh] w-auto h-auto object-contain"
            priority
          />
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
} 