import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineProject } from 'vitest/config';

export default defineProject({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] }), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // See https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker for why this is enabled
    pool: 'forks',
  },
});
