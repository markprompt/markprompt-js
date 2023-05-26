import * as esbuild from 'esbuild';

import { config } from './config.js';
import { tscPlugin } from './tsc-plugin.js';

await esbuild.build(config);
