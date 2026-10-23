import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts', 'sanity/**']),
  {
    // Pre-existing patterns; stricter rules added in eslint-plugin-react-hooks v7.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
]);

export default eslintConfig;
