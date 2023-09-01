import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@markprompt/core': '../core/src/index',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
