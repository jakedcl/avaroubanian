'use client';

import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import styles from './FilmStrip.module.css';
import { urlForImage } from '@/lib/sanity';
import type { SanityImageSource } from '@/lib/sanity';

const SCROLL_SPEED = 25;
const REPEATS = 5;
const FRAME_WIDTH_DESKTOP = 125;
/** Wider than old 85px so 4:3 frames keep a better ratio vs labels/holes on small screens */
const FRAME_WIDTH_MOBILE = 102;

export interface FilmStripProps {
  images: SanityImageSource[];
  onFrameClick?: (index: number) => void;
  userSelected?: boolean;
  onIndexChange?: (index: number) => void;
}

export default function FilmStrip({
  images,
  onFrameClick,
  userSelected = false,
  onIndexChange,
}: FilmStripProps) {
  const [frameWidth, setFrameWidth] = useState(FRAME_WIDTH_DESKTOP);
  const viewportRef = useRef<HTMLDivElement>(null);
  /** Entire film assembly — translates as one unit */
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const totalOffsetRef = useRef(0);
  const momentumRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const userSelectedRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const framePointerRef = useRef({ x: 0, dragged: false });
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    userSelectedRef.current = userSelected;
  }, [userSelected]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () =>
      setFrameWidth(mq.matches ? FRAME_WIDTH_MOBILE : FRAME_WIDTH_DESKTOP);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const wrapOffset = useCallback(() => {
    if (!images.length) return;
    const cycle = frameWidth * images.length;
    while (totalOffsetRef.current >= cycle) totalOffsetRef.current -= cycle;
    while (totalOffsetRef.current < 0) totalOffsetRef.current += cycle;
  }, [frameWidth, images.length]);

  const updateTransform = useCallback(() => {
    const el = filmTrackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(-${totalOffsetRef.current}px,0,0)`;
  }, []);

  const updateCenterIndex = useCallback(() => {
    if (
      userSelectedRef.current ||
      !onIndexChangeRef.current ||
      !images.length
    )
      return;
    const viewport = viewportRef.current;
    const track = filmTrackRef.current;
    if (!viewport || !track) return;
    const vRect = viewport.getBoundingClientRect();
    const sRect = track.getBoundingClientRect();
    const centerX = vRect.left + vRect.width / 2;
    const offsetIntoStrip = centerX - sRect.left;
    const logical = totalOffsetRef.current + offsetIntoStrip;
    const frameIdx = Math.floor(logical / frameWidth);
    const normalized =
      ((frameIdx % images.length) + images.length) % images.length;
    if (normalized !== lastIndexRef.current) {
      lastIndexRef.current = normalized;
      onIndexChangeRef.current(normalized);
    }
  }, [frameWidth, images.length]);

  useEffect(() => {
    if (!images.length) return;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (isDraggingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (Math.abs(momentumRef.current) > 0.5) {
        totalOffsetRef.current += momentumRef.current;
        momentumRef.current *= 0.95;
        wrapOffset();
        updateTransform();
        updateCenterIndex();
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      totalOffsetRef.current += SCROLL_SPEED * dt;
      wrapOffset();
      updateTransform();
      updateCenterIndex();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [images.length, wrapOffset, updateTransform, updateCenterIndex]);

  useEffect(() => {
    totalOffsetRef.current = 0;
    lastIndexRef.current = -1;
    updateTransform();
  }, [frameWidth, images.length, updateTransform]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    userSelectedRef.current = false;
    lastXRef.current = e.clientX;
    momentumRef.current = 0;
    viewportRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    totalOffsetRef.current -= dx;
    momentumRef.current = dx * 0.8;
    wrapOffset();
    updateTransform();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      viewportRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleFrameClick = (index: number) => {
    if (framePointerRef.current.dragged) return;
    userSelectedRef.current = true;
    onFrameClick?.(index);
  };

  if (!images.length) return null;

  const trackWidthPx = REPEATS * images.length * frameWidth;

  const kodakCells: ReactNode[] = [];
  const frameCells: ReactNode[] = [];
  const numberCells: ReactNode[] = [];

  for (let r = 0; r < REPEATS; r++) {
    images.forEach((img, i) => {
      const url = urlForImage(img).width(300).url();
      const showKodak = i % 4 === 0;
      const frameNum = i + 3;
      const keyBase = `strip-${r}-${i}-${img.asset?._ref ?? 'x'}`;

      kodakCells.push(
        <div
          key={`kodak-${keyBase}`}
          className={styles.kodakCell}
          style={{ width: frameWidth, flex: `0 0 ${frameWidth}px` }}
        >
          {showKodak ? (
            <span className={styles.kodakLabel}>KODAK EPP 5005</span>
          ) : (
            <span className={styles.kodakLabel} aria-hidden>
              {'\u00a0'}
            </span>
          )}
        </div>
      );

      frameCells.push(
        <div
          key={`frame-${keyBase}`}
          className={styles.frameColumn}
          style={{ width: frameWidth, flex: `0 0 ${frameWidth}px` }}
        >
          <button
            type="button"
            className={styles.frameButton}
            onClick={() => handleFrameClick(i)}
            onPointerDown={(ev) => {
              ev.stopPropagation();
              framePointerRef.current = { x: ev.clientX, dragged: false };
            }}
            onPointerMove={(ev) => {
              if (
                Math.abs(ev.clientX - framePointerRef.current.x) > 8
              ) {
                framePointerRef.current.dragged = true;
              }
            }}
            aria-label={`Frame ${frameNum}`}
          >
            <div className={styles.frameWindow}>
              <Image
                src={url}
                alt=""
                width={300}
                height={225}
                sizes={`${frameWidth}px`}
                className={`${styles.frameImage} h-full w-full object-cover`}
                draggable={false}
              />
            </div>
          </button>
        </div>
      );

      numberCells.push(
        <div
          key={`num-${keyBase}`}
          className={styles.numberCell}
          style={{ width: frameWidth, flex: `0 0 ${frameWidth}px` }}
        >
          <span className={styles.frameNumber} aria-hidden>
            ▶{frameNum}
          </span>
        </div>
      );
    });
  }

  const isMobile = frameWidth === FRAME_WIDTH_MOBILE;

  return (
    <div className={styles.filmstripShell}>
      <div
        className={`${styles.viewport} ${isMobile ? styles.viewportMobile : styles.viewportDesktop}`}
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="presentation"
      >
        <div
          ref={filmTrackRef}
          className={styles.filmTrack}
          style={{
            width: trackWidthPx,
            transform: 'translate3d(0,0,0)',
          }}
        >
          <div className={`${styles.kodakRow} ${styles.scratchBand}`}>
            {kodakCells}
          </div>
          <div className={styles.holesRow} aria-hidden />
          <div className={`${styles.stripInner} ${styles.stripInnerFilm}`}>
            {frameCells}
          </div>
          <div className={styles.holesRow} aria-hidden />
          <div className={`${styles.frameNumbersRow} ${styles.scratchBand}`}>
            {numberCells}
          </div>
        </div>
      </div>
    </div>
  );
}
