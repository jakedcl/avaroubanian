'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContactModal from '@/components/ContactModal';

function navPhotographyActive(pathname: string, type: string | null) {
  if (pathname !== '/visual') return false;
  return type !== 'visual';
}

function navArtworkActive(pathname: string, type: string | null) {
  return pathname === '/visual' && type === 'visual';
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname, searchParams]);

  const photographyActive = navPhotographyActive(pathname, type);
  const artworkActive = navArtworkActive(pathname, type);
  const audioActive = pathname === '/audio' || pathname.startsWith('/audio/');
  const shopActive = pathname === '/shop';
  const homeActive = pathname === '/';

  const linkClass = (active: boolean) =>
    `block w-full py-3 text-left text-[15px] leading-snug no-underline transition-colors ${
      active
        ? 'font-semibold text-neutral-950'
        : 'font-normal text-neutral-800 hover:text-neutral-600'
    }`;

  const NavBlock = (
    <div className="flex min-h-0 flex-1 flex-col">
      <Link href="/" className="mb-8 block shrink-0 no-underline" onClick={() => setNavOpen(false)}>
        <span className="text-xl font-semibold tracking-tight text-neutral-950 md:text-[1.35rem]">
          Ava Roubanian
        </span>
      </Link>

      <nav aria-label="Primary" className="shrink-0">
        <ul className="border-t border-neutral-200">
          <li className="border-b border-neutral-200">
            <Link href="/" className={linkClass(homeActive)}>
              Home
            </Link>
          </li>
          <li className="border-b border-neutral-200">
            <Link
              href="/visual?type=photography"
              className={linkClass(photographyActive)}
            >
              Photography
            </Link>
          </li>
          <li className="border-b border-neutral-200">
            <Link href="/visual?type=visual" className={linkClass(artworkActive)}>
              Artwork
            </Link>
          </li>
          <li className="border-b border-neutral-200">
            <Link href="/audio" className={linkClass(audioActive)}>
              Audio
            </Link>
          </li>
          <li className="border-b border-neutral-200">
            <Link href="/shop" className={linkClass(shopActive)}>
              Shop
            </Link>
          </li>
          <li className="border-b border-neutral-200">
            <button
              type="button"
              className={`${linkClass(false)} cursor-pointer bg-transparent`}
              onClick={() => {
                setContactOpen(true);
                setNavOpen(false);
              }}
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-10">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-neutral-600 no-underline hover:text-neutral-950"
        >
          Instagram
        </a>
        <p className="mt-6 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          © {new Date().getFullYear()} Ava Roubanian
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white md:flex-row">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
          <Link href="/" className="no-underline" onClick={() => setNavOpen(false)}>
            <span className="text-lg font-semibold tracking-tight text-neutral-950">
              Ava Roubanian
            </span>
          </Link>
          <button
            type="button"
            className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-800"
            aria-expanded={navOpen}
            aria-controls="site-sidebar"
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? 'Close' : 'Menu'}
          </button>
        </header>

        {navOpen ? (
          <button
            type="button"
            className="fixed inset-0 top-14 z-40 bg-black/20 md:hidden"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <aside
          id="site-sidebar"
          className={`fixed bottom-0 left-0 top-14 z-50 flex w-[min(100%,18rem)] flex-col border-r border-neutral-200 bg-white px-6 py-8 transition-transform duration-200 ease-out md:static md:top-auto md:z-0 md:h-auto md:min-h-screen md:translate-x-0 md:px-7 md:py-10 ${
            navOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {NavBlock}
        </aside>

        <main className="min-h-0 flex-1 min-w-0 px-5 py-8 md:px-10 md:py-12 lg:pl-14 lg:pr-16">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
