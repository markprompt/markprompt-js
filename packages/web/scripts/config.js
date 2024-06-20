import path from 'node:path';

import { tscPlugin } from './tsc-plugin.js';

/**
 * Shared configuration options for esbuild
 * @type {import('esbuild').BuildOptions}
 **/
const config = {
  entryPoints: ['src/index.tsx', 'src/init.ts'],
  outdir: 'dist/',
  format: 'esm',
  target: 'esnext',
  tsconfig: path.resolve(import.meta.dirname, '..', 'tsconfig.build.json'),
  bundle: true,
  treeShaking: true,
  sourcemap: true,
  jsx: 'automatic',
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
    lodash: 'lodash-es',
  },
  plugins: [tscPlugin],
};

export { config };
