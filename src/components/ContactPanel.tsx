'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  instagramUrl: string;
}

export default function ContactPanel({ isOpen, onClose, email, instagramUrl }: ContactPanelProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCopied(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 p-4 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg border border-neutral-200 bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.12)] md:p-10"
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
                className="border border-neutral-950 bg-white px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
              >
                {copied ? 'Copied' : 'Copy email'}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
