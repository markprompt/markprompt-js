import { execSync } from 'node:child_process';

/**
 * This esbuild plugin runs tsc to generate type declaration files
 * @type {import('esbuild').Plugin}
 **/
export const tscPlugin = {
  name: 'tsc',
  setup(build) {
    build.onEnd(() => {
      execSync('tsc -b tsconfig.json --clean && tsc -b tsconfig.json', {
        stdio: 'inherit',
      });
    });
  },
};
