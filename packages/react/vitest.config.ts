import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineProject, mergeConfig } from 'vitest/config';

export default mergeConfig(
  {
    plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] }), react()],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['./src/**/*'],
    },
  },
  defineProject({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],

      // See https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker for why this is enabled
      pool: 'forks',
    },
  }),
);
