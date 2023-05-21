import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import { summary } from 'rollup-plugin-summary';

export default defineConfig({
  input: ['src/index.tsx', 'src/init.ts'],
  output: {
    dir: 'dist/',
    esModule: true,
    format: 'es',
    generatedCode: 'es2015',
    interop: 'auto',
    sourcemap: true,
    validate: true,
  },
  treeshake: true,
  preserveEntrySignatures: 'strict',
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    nodeResolve({ browser: true, mainFields: ['module', 'browser', 'main'] }),
    commonjs(),
    typescript(),
    terser(),
    summary({ showGzippedSize: true, showMinifiedSize: true }),
  ],
});
