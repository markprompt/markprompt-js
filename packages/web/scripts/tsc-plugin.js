import { execSync } from 'child_process';

/** @type {import('esbuild').Plugin} */
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
