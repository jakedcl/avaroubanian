// NEXT_PUBLIC_* values must be referenced statically (process.env.NEXT_PUBLIC_X)
// so Next.js can inline them into the browser bundle. A dynamic lookup like
// process.env[name] is undefined on the client and breaks client components.
function requireEnv(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing required environment variable ${name}. Set it in Vercel project settings or a local .env file.`,
    );
  }
  return trimmed;
}

export const sanityProjectId = requireEnv(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
);
export const sanityDataset = requireEnv(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET',
);
export const sanityApiVersion = requireEnv(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  'NEXT_PUBLIC_SANITY_API_VERSION',
);
