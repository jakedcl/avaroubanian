'use client';

import { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import { TypedObject } from '@portabletext/types';

// Using a more specific type for Portable Text blocks
interface BioData {
  title?: string;
  content?: TypedObject | TypedObject[]; // Using proper Portable Text type
}

export default function AnimatedBio({ bioData }: { bioData: BioData }) {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typing animation effect for the title
  useEffect(() => {
    if (!bioData?.title) return;
    
    let currentIndex = 0;
    const fullTitle = bioData.title;
    const typingSpeed = 80; // milliseconds per character
    
    // Clear any existing interval
    setDisplayedTitle('');
    setTypingComplete(false);
    setShowContent(false);
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [bioData?.title]);
  
  // Blinking cursor effect
  useEffect(() => {
    if (typingComplete) return;
    
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, [typingComplete]);
  
  // Show the content after typing is complete
  useEffect(() => {
    if (typingComplete) {
      // Set cursor to not visible when typing is done
      setCursorVisible(false);
      
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 400); // Small delay after typing finishes
      
      return () => clearTimeout(contentTimer);
    }
  }, [typingComplete]);

  return (
    <div className="bio-content w-full">
      {/* Title with typing animation */}
      {bioData?.title && (
        <h1 className="relative">
          {displayedTitle}
          <span 
            className="typing-cursor"
            style={{ 
              opacity: cursorVisible || !typingComplete ? 1 : 0,
              height: '1.2em'
            }}
          />
        </h1>
      )}
      
      {/* Content with fade-in animation */}
      {bioData?.content && (
        <motion.div 
          className="prose prose-lg text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <PortableText value={bioData.content} />
        </motion.div>
      )}
    </div>
  );
} 