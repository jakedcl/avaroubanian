'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

// Mock track interface
interface Track {
  title: string;
  duration: string;
  file?: string;
}

// Mock audio project interface
interface AudioProject {
  id: number;
  title: string;
  type: string;
  year: string;
  duration: string;
  cover: string;
  description: string;
  tracks: Track[];
}

export default function AudioProjectPage() {
  const { id } = useParams();
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  
  // Mock data - would be fetched from a database
  const projectData: AudioProject = {
    id: Number(id),
    title: 'Nightlife',
    type: 'EP',
    year: '2023',
    duration: '18:42',
    cover: '/images/audio-placeholder-1.jpg',
    description: 'Nightlife is a collection of ambient electronic compositions exploring urban spaces after dark. The tracks blend field recordings captured in various nighttime locations with synthesizer textures and minimal percussion. This project was inspired by late-night walks through city streets and the unique atmosphere that emerges when the daytime crowds disappear.',
    tracks: [
      { title: 'Midnight Drive', duration: '4:21', file: '/audio/midnight-drive.mp3' },
      { title: 'Urban Echoes', duration: '3:45', file: '/audio/urban-echoes.mp3' },
      { title: 'Neon Dreams', duration: '5:12', file: '/audio/neon-dreams.mp3' },
      { title: 'After Hours', duration: '5:24', file: '/audio/after-hours.mp3' },
    ],
  };
  
  // If project not found
  if (!projectData) {
    return notFound();
  }
  
  // Toggle play/pause for a track
  const togglePlay = (index: number) => {
    if (activeTrack === index) {
      setActiveTrack(null);
    } else {
      setActiveTrack(index);
    }
  };
  
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
            <Link href="/audio" className="text-color-text-secondary hover:text-color-accent">
              Audio
            </Link>
            <span className="mx-2 text-color-text-secondary">/</span>
            <span className="text-color-text">{projectData.title}</span>
          </div>
        </div>
      </nav>
      
      {/* Project Header */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Album Cover */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 md:sticky md:top-24">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Cover Image
              </div>
              {/* Will be replaced with actual cover image */}
              {/* <Image
                src={projectData.cover}
                alt={projectData.title}
                fill
                className="object-cover"
              /> */}
            </div>
            
            {/* Project Details */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{projectData.title}</h1>
              
              <div className="flex items-center gap-2 text-color-text-secondary mb-6">
                <span>{projectData.type}</span>
                <span>&bull;</span>
                <span>{projectData.year}</span>
                <span>&bull;</span>
                <span>{projectData.duration}</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-3">About</h2>
                <p className="text-color-text-secondary">{projectData.description}</p>
              </div>
              
              {/* Track List with Play Controls */}
              <div className="border border-color-border rounded-lg overflow-hidden">
                <h2 className="text-lg font-medium p-4 border-b border-color-border">Tracks</h2>
                
                <ul className="divide-y divide-color-border">
                  {projectData.tracks.map((track, index) => (
                    <li 
                      key={index} 
                      className={`p-4 flex justify-between items-center ${activeTrack === index ? 'bg-color-bg-subtle' : ''}`}
                    >
                      <div className="flex items-center">
                        <button 
                          onClick={() => togglePlay(index)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-color-text-secondary hover:text-color-accent border border-current mr-4"
                          aria-label={activeTrack === index ? 'Pause' : 'Play'}
                        >
                          {activeTrack === index ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          )}
                        </button>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-color-text-secondary text-sm">{track.duration}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {/* Download button (would be functional in a real app) */}
                        <button 
                          className="p-2 text-color-text-secondary hover:text-color-accent"
                          aria-label="Download track"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Back Button */}
              <div className="mt-8">
                <Link 
                  href="/audio" 
                  className="btn btn-secondary"
                >
                  Back to Audio Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 