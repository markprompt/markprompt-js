import fs from 'node:fs/promises';

import * as esbuild from 'esbuild';

import { config } from './config.js';

const result = await esbuild.build({ ...config, minify: true, metafile: true });

// outputs a `meta.json` which can be uploaded to https://esbuild.github.io/analyze/
fs.writeFile('meta.json', JSON.stringify(result.metafile));

// outputs an analysis to the console
// eslint-disable-next-line no-console
console.log(await esbuild.analyzeMetafile(result.metafile));
