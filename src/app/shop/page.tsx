import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Shop — coming soon.',
};

export default function ShopPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
        Shop
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600 md:text-base">
        The shop is coming soon. Check back for prints, editions, and other work.
      </p>
    </div>
  );
}
