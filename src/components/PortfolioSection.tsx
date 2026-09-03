'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PhotographyContent from '@/components/PhotographyContent';
import ArtworkContent from '@/components/ArtworkContent';
import AudioContent from '@/components/AudioContent';
import FolderHeader from '@/components/FolderHeader';
import type { Section } from '@/lib/folderPaths';

export default function PortfolioSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeSection, setActiveSection] = useState<Section>('photography');
  
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'photography' || section === 'artwork' || section === 'audio') {
      setActiveSection(section);
    }
  }, [searchParams]);

  const changeSection = (section: Section) => {
    setActiveSection(section);
    router.push(`/?section=${section}`, { scroll: false });
    
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="portfolio-container">
      <div className="folder-outer">
        <FolderHeader
          activeSection={activeSection}
          onTabChange={changeSection}
        />
        <div className="portfolio-folder">
          {activeSection === 'photography' && <PhotographyContent />}
          {activeSection === 'artwork' && <ArtworkContent />}
          {activeSection === 'audio' && <AudioContent />}
        </div>
      </div>
    </div>
  );
}