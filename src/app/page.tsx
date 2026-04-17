import { getBio, getFilmstripImages } from '@/lib/sanity';
import AnimatedBio from '@/components/AnimatedBio';
import FilmStrip from '@/components/FilmStrip';
import PortfolioSection from '@/components/PortfolioSection';
import { Suspense } from 'react';

// Disable caching for this route
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [bioData, filmstripImages] = await Promise.all([
    getBio(),
    getFilmstripImages(),
  ]);

  return (
    <main className="flex flex-col items-stretch w-full max-w-none min-w-0">
      <div className="site-container">
        <section
          className={`bio-section flex flex-col items-center${filmstripImages.length > 0 ? ' bio-section--with-filmstrip' : ''}`}
        >
          <AnimatedBio bioData={bioData} />
        </section>
      </div>

      {filmstripImages.length > 0 && (
        <div className="filmstrip-wrap w-full">
          <FilmStrip images={filmstripImages} />
        </div>
      )}

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