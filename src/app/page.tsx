import { getBio } from '@/lib/sanity';
import AnimatedBio from '@/components/AnimatedBio';
import PortfolioSection from '@/components/PortfolioSection';

export default async function Home() {
  // Fetch bio data from Sanity
  const bioData = await getBio();
  
  return (
    <main className="flex flex-col items-center justify-between">
      {/* Bio Section with site-container for consistent layout */}
      <div className="site-container">
        <section className="bio-section">
          <AnimatedBio bioData={bioData} />
        </section>
      </div>
      
      {/* Portfolio Section with site-container for consistent layout */}
      <div className="site-container">
        <section id="portfolio" className="portfolio-section">
          <PortfolioSection />
        </section>
      </div>
    </main>
  );
} 