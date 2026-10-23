'use client';

import Image, { type ImageProps } from 'next/image';
import sanityImageLoader from '@/lib/sanityImageLoader';

export default function SanityImage({ src, alt, ...rest }: ImageProps) {
  if (typeof src === 'string' && src.startsWith('https://cdn.sanity.io/')) {
    return <Image src={src} alt={alt} loader={sanityImageLoader} {...rest} />;
  }
  return <Image src={src} alt={alt} {...rest} />;
}
