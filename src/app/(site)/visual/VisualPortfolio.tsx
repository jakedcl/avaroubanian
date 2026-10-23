'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
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

  return (
    <div className="pb-12">
      {loadingCollections ? (
        <p className="text-sm text-neutral-600">Loading…</p>
      ) : merged.length === 0 ? (
        <p className="text-sm text-neutral-600">No collections yet.</p>
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
                  className={`-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[15px] no-underline ${
                    active
                      ? 'border-neutral-950 font-semibold text-neutral-950'
                      : 'border-transparent font-normal text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {c.title}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 min-w-0">
            {activeMeta && (
              <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {activeMeta.title}
                </h1>
                {activeMeta.description ? (
                  <p className="mt-1 text-sm text-neutral-600">{activeMeta.description}</p>
                ) : null}
              </header>
            )}

            {loadingImages ? (
              <p className="text-sm text-neutral-600">Loading images…</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collectionImages.map((image) => (
                  <figure
                    key={image._key}
                    className="overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={urlForImage({
                        _type: 'image',
                        asset: image.asset,
                      })
                        .width(1600)
                        .fit('max')
                        .auto('format')
                        .url()}
                      alt=""
                      width={1200}
                      height={800}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function VisualPortfolio() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-sm text-neutral-600">Loading…</div>
      }
    >
      <VisualPortfolioInner />
    </Suspense>
  );
}
