'use client';

import { useEffect, useState } from 'react';

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  instagramUrl: string;
}

export default function ContactPanel({ isOpen, onClose, email, instagramUrl }: ContactPanelProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    if (!visible) return;

    setClosing(true);
    const t = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      document.body.style.overflow = '';
      setCopied(false);
    }, 300);

    return () => window.clearTimeout(t);
  }, [isOpen, visible]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`contact-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-white/40 p-4 backdrop-blur-md${closing ? ' opacity-0 transition-opacity duration-300' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`contact-panel relative w-full max-w-lg border border-neutral-200 bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.12)] md:p-10${closing ? ' opacity-0 transition-opacity duration-300' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <h2
          id="contact-title"
          className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500"
        >
          Contact
        </h2>
        <p className="mt-3 font-serif text-[17px] leading-snug text-neutral-700">
          For commissions, prints &amp; shows
        </p>

        <a
          href={`mailto:${email}`}
          className="mt-6 block break-all font-serif text-[24px] leading-tight text-neutral-950 underline decoration-neutral-300 underline-offset-[6px] hover:decoration-neutral-950 md:text-[28px]"
        >
          {email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="copy-label relative border border-neutral-950 bg-white px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
          >
            <span className={`copy-label-text${copied ? ' copy-label-text--hidden' : ''}`}>Copy email</span>
            <span
              className={`copy-label-text absolute inset-0 flex items-center justify-center${copied ? '' : ' copy-label-text--hidden'}`}
              aria-hidden={!copied}
            >
              Copied
            </span>
          </button>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-600 no-underline hover:text-neutral-950"
          >
            Instagram ↗
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 text-neutral-500 hover:text-neutral-950"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
