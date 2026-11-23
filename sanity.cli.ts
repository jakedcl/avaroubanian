import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: './sanity.types.ts',
  },
});