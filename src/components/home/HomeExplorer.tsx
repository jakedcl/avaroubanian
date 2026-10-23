import LoadedImage from '@/components/LoadedImage';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export type HomeHero = {
  src: string;
  width: number;
  height: number;
  lqip: string | null;
  alt: string;
};

export type CatalogTile = {
  href: string;
  title: string;
  kind: string;
  imageSrc: string | null;
  lqip: string | null;
};

export default function HomeExplorer({
  hero,
  intro,
  catalogTiles,
}: {
  hero: HomeHero | null;
  intro: ReactNode;
  catalogTiles: CatalogTile[];
}) {
  return (
    <div className="flex flex-col">
      {hero ? (
        <Reveal as="section" className="mb-12 md:mb-16" aria-label="Featured work">
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            placeholder={hero.lqip ? 'blur' : 'empty'}
            blurDataURL={hero.lqip ?? undefined}
            priority
            sizes="(max-width: 768px) 100vw, 1100px"
            className="hero-fade-in block h-auto max-h-[85vh] w-auto max-w-full"
          />
        </Reveal>
      ) : null}

      {intro}

      {catalogTiles.length > 0 ? (
        <ul className="grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 sm:grid-cols-2 md:gap-x-12 md:gap-y-16">
          {catalogTiles.map((tile, index) => (
            <li key={tile.href}>
              <Reveal delay={(index % 2) * 120}>
                <Link href={tile.href} className="group block no-underline">
                  <div className="img-zoom relative aspect-[4/5] w-full overflow-hidden">
                    {tile.imageSrc ? (
                      <LoadedImage
                        src={tile.imageSrc}
                        alt={tile.title}
                        fill
                        placeholder={tile.lqip ? 'blur' : 'empty'}
                        blurDataURL={tile.lqip ?? undefined}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        imgClassName="object-cover opacity-[0.92] transition-opacity duration-200 group-hover:opacity-[0.85]"
                      />
                    ) : (
                      <div className="h-full w-full border border-neutral-200" />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h2 className="font-serif text-[20px] font-medium leading-snug text-neutral-950 md:text-[22px]">
                      <span className="link-underline">{tile.title}</span>
                    </h2>
                    <span className="shrink-0 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                      {tile.kind}
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
