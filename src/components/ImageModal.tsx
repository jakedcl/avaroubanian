'use client';

import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  
  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Lock page scroll (iOS-safe) when modal is open
  useEffect(() => {
    if (!mounted) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;

    if (isOpen) {
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      documentElement.style.overflow = 'hidden';
      body.classList.add('modal-open');
    } else {
      const top = body.style.top;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.touchAction = '';
      documentElement.style.overflow = '';
      body.classList.remove('modal-open');
      if (top) {
        window.scrollTo(0, Math.abs(parseInt(top, 10)));
      }
    }
    
    return () => {
      const top = body.style.top;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.touchAction = '';
      documentElement.style.overflow = '';
      body.classList.remove('modal-open');
      if (top) {
        window.scrollTo(0, Math.abs(parseInt(top, 10)));
      }
    };
  }, [isOpen, mounted]);
  
  // Navigation function
  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (!images || images.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  }, [images]);

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
  }, [isOpen, navigate, onClose]);
  
  // If modal is closed or no images, don't render anything
  if (!isOpen || !images || images.length === 0) return null;
  
  // Get current image safely
  const currentImage = images[currentIndex];
  if (!currentImage) return null;
  
  // Inline styles to ensure maximum z-index and correct positioning
  const modalStyle: CSSProperties = {
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
    padding: 'max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))',
    margin: '0',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
  };
  
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    maxWidth: 'min(1200px, 96vw)',
    margin: '0 auto',
  };
  
  const imageContainerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '84dvh',
    maxWidth: '94vw',
  };
  
  const navButtonStyleLeft: CSSProperties = {
    position: 'absolute',
    left: 'max(12px, env(safe-area-inset-left))',
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
  };
  
  const navButtonStyleRight: CSSProperties = {
    ...navButtonStyleLeft,
    left: 'auto',
    right: 'max(12px, env(safe-area-inset-right))',
  };
  
  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: 'max(12px, env(safe-area-inset-top))',
    right: 'max(12px, env(safe-area-inset-right))',
    zIndex: 2147483647,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    color: 'white',
    borderRadius: '9999px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  };
  
  const imageCounterStyle: CSSProperties = {
    position: 'absolute',
    bottom: 'max(12px, env(safe-area-inset-bottom))',
    left: '0',
    right: '0',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px 0',
    zIndex: 2147483647,
    fontWeight: '500',
    fontSize: '16px',
  };

  if (!mounted) return null;

  return createPortal(
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
          aria-label="Close fullscreen image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              maxHeight: '84dvh',
              maxWidth: '94vw',
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
    </div>,
    document.body
  );
} 