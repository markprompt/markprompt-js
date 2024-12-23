import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@markprompt/core': path.resolve(__dirname, '../../packages/core/dist'),
    },
  },
  optimizeDeps: {
    exclude: ['@markprompt/web', '@markprompt/css', '@markprompt/react'],
  },
  ssr: {
    noExternal: ['@markprompt/css'],
  },
});
