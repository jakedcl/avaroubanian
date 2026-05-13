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
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 md:text-xl">
          Featured
        </h2>
        <div className="relative mt-6 aspect-[4/3] w-full max-w-4xl bg-neutral-100">
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
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 md:text-xl">
          Catalog
        </h2>
        {catalogTiles.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-600">No collections yet.</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {catalogTiles.map((tile) => (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className="group block no-underline"
                >
                  <div className="aspect-[4/5] w-full bg-neutral-100">
                    {tile.imageSrc ? (
                      <Image
                        src={tile.imageSrc}
                        alt=""
                        width={640}
                        height={800}
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-wider text-neutral-400">
                        No preview
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-center text-[15px] font-medium leading-snug text-neutral-950 md:text-base">
                    {tile.title}
                  </h3>
                  <p className="mt-1 text-center text-[13px] text-neutral-500">
                    {tile.subtitle}
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
