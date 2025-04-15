import { getBio } from '@/lib/sanity';
import AnimatedBio from '@/components/AnimatedBio';
import PortfolioSection from '@/components/PortfolioSection';
import { Suspense } from 'react';

// Disable caching for this route
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch bio data from Sanity with cache busting
  const bioData = await getBio();
  
  // Log the bio data for debugging
  console.log('Fetched bio data:', bioData);
  
  return (
    <main className="flex flex-col items-center justify-between w-full">
      {/* Bio Section with site-container for consistent layout */}
      <div className="site-container">
        <section className="bio-section flex flex-col items-center">
          <AnimatedBio bioData={bioData} />
        </section>
      </div>
      
      {/* Portfolio Section with site-container for consistent layout */}
      <div className="site-container">
        <section id="portfolio" className="portfolio-section">
          <Suspense fallback={
            <div className="portfolio-container">
              <div className="main-tabs-container">
                <div className="main-tab active"><span>Loading</span></div>
              </div>
              <div className="portfolio-folder relative">
                <div className="folder-loading">
                  <div className="loading-spinner"></div>
                </div>
              </div>
            </div>
          }>
            <PortfolioSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
} 