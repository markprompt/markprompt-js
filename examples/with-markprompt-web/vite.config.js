import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@markprompt/web', '@markprompt/css', '@markprompt/react'],
  },
  ssr: {
    noExternal: ['@markprompt/css'],
  },
});
