'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { urlForImage } from '@/lib/sanity';

interface AudioCollection {
  _id: string;
  title: string;
  description?: string;
  order?: number;
}

interface Track {
  _key: string;
  title: string;
  description?: string;
  mediaType?: string;
  coverImage?: { asset: { _ref: string; _type?: string } };
  mediaFile?: { asset?: { url?: string } };
}

function mediaUrl(t: Track) {
  return t.mediaFile?.asset?.url;
}

function AudioLibraryInner() {
  const searchParams = useSearchParams();
  const [collections, setCollections] = useState<AudioCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      try {
        const res = await fetch('/api/audio');
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;
        const sorted = [...data].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
        setCollections(sorted);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadingList || collections.length === 0) return;
    const c = searchParams.get('collection');
    if (c && collections.some((x) => x._id === c)) {
      setActiveCollection(c);
    } else {
      setActiveCollection(collections[0]._id);
    }
  }, [collections, loadingList, searchParams]);

  useEffect(() => {
    if (!activeCollection) return;
    let cancelled = false;
    (async () => {
      setLoadingTracks(true);
      try {
        const res = await fetch(`/api/audio?collectionId=${activeCollection}`);
        const data = await res.json();
        if (cancelled) return;
        setTracks(Array.isArray(data?.tracks) ? data.tracks : []);
        setCurrentTrack(null);
      } finally {
        if (!cancelled) setLoadingTracks(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCollection]);

  const activeMeta = collections.find((c) => c._id === activeCollection);
  const currentUrl = currentTrack ? mediaUrl(currentTrack) : undefined;

  return (
    <div className="pb-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <nav className="shrink-0 lg:w-52" aria-label="Audio collections">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Collections
          </p>
          {loadingList ? (
            <p className="mt-3 text-sm text-neutral-600">Loading…</p>
          ) : (
            <ul className="mt-3 border-t border-neutral-200">
              {collections.map((c) => (
                <li key={c._id} className="border-b border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setActiveCollection(c._id)}
                    className={`w-full py-3 text-left text-[15px] leading-snug ${
                      activeCollection === c._id
                        ? 'font-semibold text-neutral-950'
                        : 'font-normal text-neutral-700 hover:text-neutral-950'
                    }`}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="min-w-0 flex-1">
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

          {currentTrack && currentUrl && (
            <div className="mb-10 border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-[15px] font-medium text-neutral-950">{currentTrack.title}</p>
              {currentTrack.mediaType === 'video' ? (
                <video
                  key={currentTrack._key}
                  className="mt-4 max-h-[min(480px,70vh)] w-full"
                  controls
                  src={currentUrl}
                />
              ) : (
                <audio
                  key={currentTrack._key}
                  className="mt-4 w-full"
                  controls
                  src={currentUrl}
                />
              )}
            </div>
          )}

          {loadingTracks ? (
            <p className="text-sm text-neutral-600">Loading tracks…</p>
          ) : (
            <ul className="border-t border-neutral-200">
              {tracks.map((t) => {
                const url = mediaUrl(t);
                const ref = t.coverImage?.asset?._ref;
                return (
                  <li key={t._key} className="border-b border-neutral-200">
                    <button
                      type="button"
                      disabled={!url}
                      onClick={() => url && setCurrentTrack(t)}
                      className={`flex w-full items-center gap-4 py-3 text-left ${
                        currentTrack?._key === t._key
                          ? 'font-semibold text-neutral-950'
                          : 'font-normal text-neutral-700 hover:text-neutral-950'
                      } ${!url ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      {ref ? (
                        <Image
                          src={urlForImage({
                            _type: 'image',
                            asset: {
                              _ref: ref,
                              _type: 'reference',
                            },
                          })
                            .width(48)
                            .height(48)
                            .url()}
                          alt=""
                          width={48}
                          height={48}
                          className="h-11 w-11 shrink-0 object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-100 text-xs text-neutral-400">
                          {t.mediaType === 'video' ? '▶' : '♪'}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block text-[15px] leading-snug">{t.title}</span>
                        {t.description ? (
                          <span className="mt-0.5 block text-[13px] text-neutral-500 line-clamp-2">
                            {t.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AudioLibrary() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-sm text-neutral-600">Loading…</div>
      }
    >
      <AudioLibraryInner />
    </Suspense>
  );
}
