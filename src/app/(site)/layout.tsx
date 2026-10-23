import { Suspense } from 'react';
import SiteShell from '@/components/SiteShell';
import { getAudioCollectionCount, getSiteSettings } from '@/lib/sanity';

export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, audioCount] = await Promise.all([
    getSiteSettings(),
    getAudioCollectionCount(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" aria-hidden />}>
      <SiteShell
        contactEmail={settings.contactEmail}
        instagramUrl={settings.instagramUrl}
        hasAudio={audioCount > 0}
      >
        {children}
      </SiteShell>
    </Suspense>
  );
}
