'use client';

import Lightbox, { type LightboxImage } from '@/components/Lightbox';
import LoadedImage from '@/components/LoadedImage';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { urlForImage } from '@/lib/sanity';

type Kind = 'photography' | 'visual';

interface Collection {
  _id: string;
  title: string;
  order?: number;
  description?: string;
}

interface MergedCollection extends Collection {
  kind: Kind;
}

interface CollectionImage {
  _key: string;
  asset: { _ref: string; _type: string };
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  lqip?: string | null;
}

function mergeCollections(
  photo: Collection[],
  vis: Collection[],
): MergedCollection[] {
  const p = [...photo]
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
    .map((c) => ({ ...c, kind: 'photography' as const }));
  const v = [...vis]
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
    .map((c) => ({ ...c, kind: 'visual' as const }));
  return [...p, ...v];
}

function VisualPortfolioInner() {
  const searchParams = useSearchParams();
  const [merged, setMerged] = useState<MergedCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCollections(true);
      try {
        const res = await fetch('/api/visual');
        const data = await res.json();
        if (cancelled) return;
        if (data?.photography || data?.visual) {
          setMerged(
            mergeCollections(
              Array.isArray(data.photography) ? data.photography : [],
              Array.isArray(data.visual) ? data.visual : [],
            ),
          );
        } else {
          setMerged([]);
        }
      } finally {
        if (!cancelled) setLoadingCollections(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadingCollections || merged.length === 0) return;
    const c = searchParams.get('collection');
    const t = searchParams.get('type');

    if (c && merged.some((m) => m._id === c)) {
      setActiveCollection(c);
      return;
    }

    if (t === 'visual') {
      const firstV = merged.find((m) => m.kind === 'visual');
      if (firstV) {
        setActiveCollection(firstV._id);
        return;
      }
    }

    const firstP = merged.find((m) => m.kind === 'photography');
    if (firstP) {
      setActiveCollection(firstP._id);
      return;
    }

    setActiveCollection(merged[0]._id);
  }, [loadingCollections, merged, searchParams]);

  const activeKind = useMemo(() => {
    const hit = merged.find((m) => m._id === activeCollection);
    return hit?.kind ?? 'photography';
  }, [merged, activeCollection]);

  useEffect(() => {
    if (!activeCollection) return;
    setLightboxIndex(null);
    let cancelled = false;
    (async () => {
      setLoadingImages(true);
      try {
        const res = await fetch(
          `/api/visual?type=${activeKind}&collectionId=${activeCollection}`,
        );
        const data = await res.json();
        if (cancelled) return;
        setCollectionImages(Array.isArray(data?.images) ? data.images : []);
      } finally {
        if (!cancelled) setLoadingImages(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeKind, activeCollection]);

  const activeMeta = merged.find((c) => c._id === activeCollection);
  const activeTitle = activeMeta?.title ?? '';

  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      collectionImages.map((img) => ({
        key: img._key,
        src: urlForImage({ _type: 'image', asset: img.asset })
          .width(2400)
          .fit('max')
          .auto('format')
          .quality(90)
          .url(),
        width: img.dimensions?.width ?? 1600,
        height: img.dimensions?.height ?? 1200,
        lqip: img.lqip ?? null,
        alt: activeTitle,
      })),
    [collectionImages, activeTitle],
  );

  return (
    <div className="pb-12">
      {loadingCollections ? (
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">Loading…</p>
      ) : merged.length === 0 ? (
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">No collections yet.</p>
      ) : (
        <>
          <nav
            aria-label="Collections"
            className="-mx-5 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-neutral-200 px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 md:gap-10 [&::-webkit-scrollbar]:hidden"
          >
            {merged.map((c) => {
              const active = activeCollection === c._id;
              return (
                <Link
                  key={c._id}
                  href={`/visual?type=${c.kind}&collection=${c._id}`}
                  scroll={false}
                  className={`-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 font-sans text-[12px] uppercase tracking-[0.08em] no-underline ${
                    active
                      ? 'border-neutral-950 font-medium text-neutral-950'
                      : 'border-transparent font-medium text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  {c.title}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 min-w-0">
            {activeMeta && (
              <header className="mb-8">
                <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-neutral-950 md:text-[32px]">
                  {activeMeta.title}
                </h1>
                {activeMeta.description ? (
                  <p className="mt-2 max-w-[60ch] text-[17px] leading-relaxed text-neutral-600">{activeMeta.description}</p>
                ) : null}
              </header>
            )}

            {loadingImages ? (
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">Loading images…</p>
            ) : (
              <div className="columns-1 gap-[10px] sm:columns-2 lg:columns-3">
                {collectionImages.map((image, i) => (
                  <Reveal key={image._key} delay={Math.min((i % 3) * 80, 240)} className="mb-[10px] break-inside-avoid">
                    <figure>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        aria-label={`Open image ${i + 1} of ${collectionImages.length}`}
                        className="img-zoom block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                      >
                        <LoadedImage
                          src={urlForImage({
                            _type: 'image',
                            asset: image.asset,
                          })
                            .width(1600)
                            .fit('max')
                            .auto('format')
                            .url()}
                          alt={activeMeta?.title ?? ''}
                          width={image.dimensions?.width ?? 1200}
                          height={image.dimensions?.height ?? 800}
                          placeholder={image.lqip ? 'blur' : 'empty'}
                          blurDataURL={image.lqip ?? undefined}
                          imgClassName="block h-auto w-full opacity-[0.92] transition-opacity duration-200 hover:opacity-[0.85]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </button>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        caption={activeTitle}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}

export default function VisualPortfolio() {
  return (
    <Suspense
      fallback={
        <div className="py-8 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">Loading…</div>
      }
    >
      <VisualPortfolioInner />
    </Suspense>
  );
}
