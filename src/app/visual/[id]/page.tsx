'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';

interface WorkDetailsProps {
  id: number;
  title: string;
  description: string;
  category: string;
  year: string;
  dimensions?: string;
  medium: string;
  images: string[];
}

export default function VisualWorkPage() {
  const { id } = useParams();
  
  // Mock data for this demo - would be fetched from a database
  const workDetails: WorkDetailsProps = {
    id: Number(id),
    title: 'Urban Landscapes',
    description: 'A series exploring the juxtaposition of natural and man-made elements in urban environments. Each image captures moments where nature and architecture intersect, creating unexpected harmonies and tensions.',
    category: 'Photography',
    year: '2023',
    dimensions: '24" x 36"',
    medium: 'Digital Photography, Archival Print',
    images: [
      '/images/placeholder-1.jpg',
      '/images/placeholder-2.jpg',
      '/images/placeholder-3.jpg',
    ],
  };
  
  // If work not found
  if (!workDetails) {
    return notFound();
  }
  
  return (
    <>
      {/* Breadcrumb */}
      <nav className="py-4 border-b border-color-border">
        <div className="container">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-color-text-secondary hover:text-color-accent">
              Home
            </Link>
            <span className="mx-2 text-color-text-secondary">/</span>
            <Link href="/visual" className="text-color-text-secondary hover:text-color-accent">
              Visual
            </Link>
            <span className="mx-2 text-color-text-secondary">/</span>
            <span className="text-color-text">{workDetails.title}</span>
          </div>
        </div>
      </nav>
      
      {/* Work Details */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              {workDetails.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative aspect-[4/3] overflow-hidden bg-gray-100"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Image Placeholder {index + 1}
                  </div>
                  {/* Will be replaced with actual images */}
                  {/* <Image
                    src={image}
                    alt={`${workDetails.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  /> */}
                </div>
              ))}
            </div>
            
            {/* Work Information */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{workDetails.title}</h1>
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-6 border-b border-color-border pb-6">
                  <div className="text-color-text-secondary">Category</div>
                  <div>{workDetails.category}</div>
                  
                  <div className="text-color-text-secondary">Year</div>
                  <div>{workDetails.year}</div>
                  
                  {workDetails.dimensions && (
                    <>
                      <div className="text-color-text-secondary">Dimensions</div>
                      <div>{workDetails.dimensions}</div>
                    </>
                  )}
                  
                  <div className="text-color-text-secondary">Medium</div>
                  <div>{workDetails.medium}</div>
                </div>
                
                <div>
                  <h2 className="text-xl font-medium mb-3">About this work</h2>
                  <p className="text-color-text-secondary">{workDetails.description}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link href="/visual" className="btn btn-secondary">
                  Back to Visual Works
                </Link>
                <a 
                  href="#contact" 
                  className="btn btn-primary"
                >
                  Inquire About This Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Works - could be added here */}
    </>
  );
} 