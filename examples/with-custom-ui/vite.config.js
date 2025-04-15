import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@markprompt/web', '@markprompt/css', '@markprompt/react'],
  },
  ssr: {
    noExternal: ['@markprompt/css'],
  },
});
