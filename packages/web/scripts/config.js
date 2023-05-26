import { tscPlugin } from './tsc-plugin.js';

/** @type {import('esbuild').CommonOptions} */
const config = {
  entryPoints: ['src/index.tsx', 'src/init.ts'],
  outdir: 'dist/',
  bundle: true,
  treeShaking: true,
  format: 'esm',
  sourcemap: true,
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  plugins: [tscPlugin],
};

export { config };
