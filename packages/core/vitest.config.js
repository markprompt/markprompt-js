import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    pool: 'forks',
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['./src/**/*'],
    },
  },
});
