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
}

export default function FilmStrip({ images }: FilmStripProps) {
  const [frameWidth, setFrameWidth] = useState(FRAME_WIDTH_DESKTOP);
  /** Entire film assembly — translates as one unit */
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const totalOffsetRef = useRef(0);

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

  useEffect(() => {
    if (!images.length) return;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      totalOffsetRef.current += SCROLL_SPEED * dt;
      wrapOffset();
      updateTransform();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [images.length, wrapOffset, updateTransform]);

  useEffect(() => {
    totalOffsetRef.current = 0;
    updateTransform();
  }, [frameWidth, images.length, updateTransform]);

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
          <div className={styles.frameWindow} aria-hidden>
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
