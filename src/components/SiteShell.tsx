'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContactPanel from '@/components/ContactPanel';

function navPhotographyActive(pathname: string, type: string | null) {
  if (pathname !== '/visual') return false;
  return type !== 'visual';
}

function navArtworkActive(pathname: string, type: string | null) {
  return pathname === '/visual' && type === 'visual';
}

type SiteShellProps = {
  children: React.ReactNode;
  contactEmail: string;
  instagramUrl: string;
  hasAudio: boolean;
};

export default function SiteShell({ children, contactEmail, instagramUrl, hasAudio }: SiteShellProps) {
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
  const audioActive = pathname === '/audio';
  const homeActive = pathname === '/';

  const linkClass = (active: boolean) =>
    `block w-full py-1 text-left font-sans text-[12px] uppercase tracking-[0.08em] leading-snug no-underline transition-colors ${
      active
        ? 'font-semibold text-neutral-950'
        : 'font-normal text-neutral-500 hover:text-neutral-950'
    }`;

  const navLabel = (text: string) => <span className="link-underline">{text}</span>;

  const dash = (active: boolean) => (
    <span aria-hidden className="inline-block w-4 text-neutral-950">
      {active ? '—' : ''}
    </span>
  );

  const NavBlock = (
    <div className="flex min-h-0 flex-1 flex-col">
      <Link href="/" className="mb-10 block shrink-0 no-underline" onClick={() => setNavOpen(false)}>
        <span className="font-serif text-[22px] font-medium leading-tight tracking-tight text-neutral-950 md:text-[24px]">
          Ava Roubanian
        </span>
      </Link>

      <nav aria-label="Primary" className="shrink-0">
        <ul className="flex flex-col gap-[10px]">
          <li>
            <Link href="/" className={linkClass(homeActive)} aria-current={homeActive ? 'page' : undefined}>
              {dash(homeActive)}
              {navLabel('Home')}
            </Link>
          </li>
          <li>
            <Link
              href="/visual?type=photography"
              className={linkClass(photographyActive)}
              aria-current={photographyActive ? 'page' : undefined}
            >
              {dash(photographyActive)}
              {navLabel('Photography')}
            </Link>
          </li>
          <li>
            <Link
              href="/visual?type=visual"
              className={linkClass(artworkActive)}
              aria-current={artworkActive ? 'page' : undefined}
            >
              {dash(artworkActive)}
              {navLabel('Artwork')}
            </Link>
          </li>
          {hasAudio ? (
            <li>
              <Link href="/audio" className={linkClass(audioActive)} aria-current={audioActive ? 'page' : undefined}>
                {dash(audioActive)}
                {navLabel('Audio')}
              </Link>
            </li>
          ) : null}
          <li>
            <button
              type="button"
              className={`${linkClass(contactOpen)} cursor-pointer bg-transparent`}
              onClick={() => {
                setContactOpen(true);
                setNavOpen(false);
              }}
            >
              {dash(contactOpen)}
              {navLabel('Contact')}
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-10">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500 no-underline hover:text-neutral-950"
        >
          Instagram
        </a>
        <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.08em] text-neutral-400">
          © {new Date().getFullYear()} Ava Roubanian
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-[17px] leading-[1.6] md:flex-row md:text-[18px]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
          <Link href="/" className="no-underline" onClick={() => setNavOpen(false)}>
            <span className="font-serif text-[22px] font-medium leading-none tracking-tight text-neutral-950">
              Ava Roubanian
            </span>
          </Link>
          <button
            type="button"
            className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-800"
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
            className="nav-drawer-backdrop fixed inset-0 top-14 z-40 bg-black/20 md:hidden"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <aside
          id="site-sidebar"
          className={`fixed bottom-0 left-0 top-14 z-50 flex w-[min(100%,18rem)] flex-col border-r border-neutral-200 bg-white px-6 py-8 md:static md:top-auto md:z-0 md:h-auto md:min-h-screen md:w-60 md:border-r-0 md:translate-x-0 md:px-8 md:py-12 ${
            navOpen
              ? 'nav-drawer-panel translate-x-0 shadow-xl'
              : '-translate-x-full md:translate-x-0'
          }`}
        >
          {NavBlock}
        </aside>

        <main className="min-h-0 flex-1 min-w-0 px-5 py-8 md:px-10 md:py-12 lg:pl-14 lg:pr-16">
          <div className="page-enter mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <ContactPanel
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        email={contactEmail}
        instagramUrl={instagramUrl}
      />
    </>
  );
}
