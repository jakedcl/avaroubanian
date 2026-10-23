'use client';

import SanityImage from '@/components/SanityImage';
import { useState, type ComponentProps } from 'react';

type LoadedImageProps = ComponentProps<typeof SanityImage> & {
  imgClassName?: string;
};

/** Next/Image with a soft opacity fade-in once the image has loaded. */
export default function LoadedImage({
  className,
  imgClassName,
  onLoad,
  fill,
  alt = '',
  ...props
}: LoadedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const wrapperClass = fill
    ? `relative block h-full w-full${className ? ` ${className}` : ''}`
    : className ?? '';

  return (
    <span className={wrapperClass || undefined}>
      <SanityImage
        {...props}
        alt={alt}
        fill={fill}
        className={`img-loaded${loaded ? ' is-loaded' : ''}${imgClassName ? ` ${imgClassName}` : ''}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </span>
  );
}
