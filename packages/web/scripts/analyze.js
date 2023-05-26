import fs from 'node:fs/promises';

import * as esbuild from 'esbuild';

import { config } from './config.js';

const result = await esbuild.build({ ...config, metafile: true });

fs.writeFile('meta.json', JSON.stringify(result.metafile));
console.log(await esbuild.analyzeMetafile(result.metafile));
