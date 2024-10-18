import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname),
  ...configs.react,
  ...configs.biome,
];
