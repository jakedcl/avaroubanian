'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type LoadedImageProps = ImageProps & {
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
      <Image
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
