'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export type HomeSlide = { src: string; alt: string };

export type CatalogTile = {
  href: string;
  title: string;
  subtitle: string;
  imageSrc: string | null;
};

export default function HomeExplorer({
  slides,
  initialSlideIndex,
  catalogTiles,
}: {
  slides: HomeSlide[];
  initialSlideIndex: number;
  catalogTiles: CatalogTile[];
}) {
  const [slideIndex, setSlideIndex] = useState(
    slides.length > 0 ? Math.min(initialSlideIndex, slides.length - 1) : 0,
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const id = window.setInterval(() => {
      setSlideIndex(Math.floor(Math.random() * slides.length));
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const current = slides[slideIndex];

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <section>
        <div className="img-zoom relative aspect-[4/3] w-full max-w-4xl">
          {current ? (
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
              No images yet
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
          Catalog
        </h2>
        {catalogTiles.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-600">No collections yet.</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
            {catalogTiles.map((tile) => (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className="group block no-underline"
                >
                  <div className="img-zoom aspect-[4/5] w-full">
                    {tile.imageSrc ? (
                      <Image
                        src={tile.imageSrc}
                        alt=""
                        width={640}
                        height={800}
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-wider text-neutral-400">
                        No preview
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-center text-[14px] font-medium leading-snug text-neutral-950 sm:text-[15px] md:text-base">
                    <span className="link-underline">{tile.title}</span>
                  </h3>
                  <p className="mt-1 text-center text-[12px] text-neutral-500 sm:text-[13px]">
                    <span className="link-underline">{tile.subtitle}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
