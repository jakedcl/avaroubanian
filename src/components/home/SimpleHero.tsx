type Bio = {
  contentPlain?: string | null;
};

/** Intro copy only — site name lives in the sidebar. */
export default function SimpleHero({ bio }: { bio: Bio | null }) {
  const body = bio?.contentPlain?.trim() || '';
  if (!body) return null;

  return (
    <div className="mb-12 max-w-2xl text-[15px] leading-[1.7] text-neutral-700 md:mb-14 md:text-base md:leading-relaxed">
      {body}
    </div>
  );
}
