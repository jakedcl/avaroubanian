'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PhotographyContent from '@/components/PhotographyContent';
import ArtworkContent from '@/components/ArtworkContent';
import AudioContent from '@/components/AudioContent';

export default function PortfolioSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to 'photography' if no section is specified
  const [activeSection, setActiveSection] = useState<'photography' | 'artwork' | 'audio'>('photography');
  
  // Update active section based on URL parameters
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'photography' || section === 'artwork' || section === 'audio') {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Handle tab change
  const changeSection = (section: 'photography' | 'artwork' | 'audio') => {
    setActiveSection(section);
    router.push(`/?section=${section}`, { scroll: false });
    
    // Smooth scroll to portfolio section
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="portfolio-container">
      {/* Main Category Tabs */}
      <div className="main-tabs-container">
        <div
          className={`main-tab ${activeSection === 'photography' ? 'active' : ''}`}
          onClick={() => changeSection('photography')}
        >
          <span>Photography</span>
        </div>
        <div
          className={`main-tab ${activeSection === 'artwork' ? 'active' : ''}`}
          onClick={() => changeSection('artwork')}
        >
          <span>Artwork</span>
        </div>
        <div
          className={`main-tab ${activeSection === 'audio' ? 'active' : ''}`}
          onClick={() => changeSection('audio')}
        >
          <span>Audio</span>
        </div>
      </div>

      {/* Portfolio Folder with Content */}
      <div className="portfolio-folder">
        {/* Content based on active section */}
        {activeSection === 'photography' && <PhotographyContent />}
        {activeSection === 'artwork' && <ArtworkContent />}
        {activeSection === 'audio' && <AudioContent />}
      </div>
    </div>
  );
} 