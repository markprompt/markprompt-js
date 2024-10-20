import { astro } from './astro.js';
import { base } from './base.js';
import { biome } from './biome.js';
import { next } from './next.js';
import { react } from './react.js';
import { vitest } from './vitest.js';

export const configs = {
  astro: astro,
  base: base,
  biome: biome,
  next: next,
  react: react,
  vitest: vitest,
} as const;
