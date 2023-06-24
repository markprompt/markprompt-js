import Slugger from 'github-slugger';

import type { SectionHeading } from './types.js';

const pathToHref = (path: string): string => {
  const lastDotIndex = path.lastIndexOf('.');
  let cleanPath = path;
  if (lastDotIndex >= 0) {
    cleanPath = path.substring(0, lastDotIndex);
  }
  if (cleanPath.endsWith('/index')) {
    cleanPath = cleanPath.replace(/\/index/gi, '');
  }
  return cleanPath;
};

export const getHref = (
  filePath: string,
  sectionHeading: SectionHeading | undefined,
): string => {
  const p = pathToHref(filePath);
  if (sectionHeading?.id) {
    return `${p}#${sectionHeading.id}`;
  } else if (sectionHeading?.value) {
    // Do not reuse a Slugger instance, as it will
    // append `-1`, `-2`, ... to links if it encounters the
    // same link twice.
    const slugger = new Slugger();
    return `${p}#${slugger.slug(sectionHeading.value)}`;
  }
  return p;
};
