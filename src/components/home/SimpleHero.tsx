type Bio = {
  contentPlain?: string | null;
};

/** Intro copy only — site name lives in the sidebar. */
export default function SimpleHero({ bio }: { bio: Bio | null }) {
  const body = bio?.contentPlain?.trim() || '';
  if (!body) return null;

  return (
    <div className="mb-12 max-w-[60ch] font-serif text-[20px] leading-[1.5] text-neutral-800 md:mb-16 md:text-[22px]">
      {body}
    </div>
  );
}
