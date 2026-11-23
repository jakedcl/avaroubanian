function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Set it in Vercel project settings or a local .env file.`,
    );
  }
  return value;
}

export const sanityProjectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
export const sanityDataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET');
export const sanityApiVersion = requireEnv('NEXT_PUBLIC_SANITY_API_VERSION');