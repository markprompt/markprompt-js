import { defineProject, mergeConfig } from 'vitest/config';

export default mergeConfig(
  {
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['./src/**/*'],
    },
  },
  defineProject({
    test: {
      pool: 'forks',
    },
  }),
);
