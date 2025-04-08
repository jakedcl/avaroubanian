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
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
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
  
  // Inline styles to ensure maximum z-index and correct positioning
  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(5px)',
    zIndex: 2147483647, // Maximum possible z-index value to ensure modal is above everything
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    margin: '0',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  } as React.CSSProperties;
  
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties;
  
  const imageContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '80vh',
    maxWidth: '90vw',
  } as React.CSSProperties;
  
  const navButtonStyleLeft = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2147483647,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties;
  
  const navButtonStyleRight = {
    ...navButtonStyleLeft,
    left: 'auto',
    right: '20px',
  } as React.CSSProperties;
  
  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 2147483647,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties;
  
  const imageCounterStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px 0',
    zIndex: 2147483647,
    fontWeight: '500',
    fontSize: '16px',
  } as React.CSSProperties;
  
  return (
    <div 
      style={modalStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button 
          style={closeButtonStyle}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Left navigation button */}
        <button
          style={navButtonStyleLeft}
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
        
        {/* Right navigation button */}
        <button
          style={navButtonStyleRight}
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
        <div style={imageContainerStyle}>
          <Image
            src={urlForImage(currentImage)
              .width(1800)
              .url()}
            alt=""
            width={1800}
            height={1200}
            style={{
              maxHeight: '80vh',
              maxWidth: '90vw',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            }}
            priority
            unoptimized={false}
            sizes="(max-width: 768px) 95vw, 90vw"
          />
        </div>
        
        {/* Image counter */}
        <div style={imageCounterStyle}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
} 