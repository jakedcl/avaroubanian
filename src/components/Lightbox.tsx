'use client';

import LoadedImage from '@/components/LoadedImage';
import { useCallback, useEffect, useRef, useState } from 'react';

export type LightboxImage = {
  key: string;
  src: string;
  width: number;
  height: number;
  lqip: string | null;
  alt: string;
};

type LightboxProps = {
  images: LightboxImage[];
  index: number | null;
  caption: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const LABEL = 'font-sans text-[11px] font-medium uppercase tracking-[0.08em]';

export default function Lightbox({ images, index, caption, onClose, onIndexChange }: LightboxProps) {
  const count = images.length;
  const i = index ?? -1;
  const current = i >= 0 && i < count ? images[i] : null;
  const isOpen = current !== null;
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  const prev = useCallback(() => {
    if (i < 0 || count === 0) return;
    onIndexChange((i - 1 + count) % count);
  }, [i, count, onIndexChange]);

  const next = useCallback(() => {
    if (i < 0 || count === 0) return;
    onIndexChange((i + 1) % count);
  }, [i, count, onIndexChange]);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, requestClose, prev, next]);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen, i]);

  if (!isOpen && !closing) return null;

  const display = current;

  return (
    <div
      className={`lightbox-overlay fixed inset-0 z-[110] flex flex-col bg-white${closing ? ' lightbox-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={caption || 'Image viewer'}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? start) - start;
        if (dx > 50) prev();
        else if (dx < -50) next();
      }}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4 md:px-8">
        <p className={`${LABEL} text-neutral-500`}>
          {i + 1} / {count}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close viewer"
          className={`${LABEL} p-2 text-neutral-700 hover:text-neutral-950`}
        >
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        {display ? (
          <div
            key={display.key}
            className="lightbox-image flex h-full w-full items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) requestClose();
            }}
          >
            <LoadedImage
              src={display.src}
              alt={display.alt}
              width={display.width}
              height={display.height}
              placeholder={display.lqip ? 'blur' : 'empty'}
              blurDataURL={display.lqip ?? undefined}
              sizes="100vw"
              priority
              imgClassName="h-auto max-h-[calc(100dvh-8rem)] w-auto max-w-full object-contain"
            />
          </div>
        ) : null}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-1 top-1/2 -translate-y-1/2 p-3 text-neutral-500 hover:text-neutral-950 md:left-6"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-3 text-neutral-500 hover:text-neutral-950 md:right-6"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      <div className="shrink-0 px-4 py-4 text-center md:px-8">
        <p className={`${LABEL} text-neutral-600`}>{caption}</p>
      </div>
    </div>
  );
}
