import type {
  AlgoliaDocSearchHit,
  SearchResult,
} from '@markprompt/core/search';
import type { Source } from '@markprompt/core/types';
import { describe, expect, test } from 'vitest';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';

const basePath = '/docs/guides';
const filePath = `${basePath}/index.md`;
const urlPath = `${basePath}/blog/post1`;
const heading = 'Heading 1';
const headingSlug = 'heading-1';
const headingId = 'generated-id';
const noTitleFileName = 'no-title';
const githubSource: Source = { id: '0', type: 'github' };
const websiteSource: Source = { id: '0', type: 'website' };
const shortContent = 'Some content';

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const loremIpsumKwicSnippet =
  'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,';

const results: (SearchResult & { sectionId: number })[] = [
  {
    matchType: 'leadHeading',
    file: { path: filePath, source: githubSource },
    meta: { leadHeading: { value: heading, slug: headingSlug } },
    sectionId: 0,
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/index.md`, title: 'Home', source: githubSource },
    sectionId: 0,
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/${noTitleFileName}.md`, source: githubSource },
    sectionId: 0,
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/${noTitleFileName}`, source: githubSource },
    sectionId: 0,
  },
  {
    matchType: 'content',
    snippet: loremIpsum,
    file: { path: `${urlPath}/${noTitleFileName}`, source: websiteSource },
    sectionId: 0,
  },
  {
    matchType: 'content',
    snippet: `## ${heading}\n\n${shortContent}`,
    file: { path: `${urlPath}/${noTitleFileName}`, source: websiteSource },
    meta: { leadHeading: { value: heading, slug: headingSlug } },
    sectionId: 0,
  },
  {
    matchType: 'leadHeading',
    file: { path: urlPath, source: websiteSource },
    meta: { leadHeading: { value: heading, slug: headingSlug, id: headingId } },
    sectionId: 0,
  },
];

const algoliaSearchHits = [
  {
    url: 'https://markprompt.com/docs/hit',
    hierarchy: {
      lvl0: null,
      lvl1: 'React',
      lvl2: 'React introduction',
    },
    _highlightResult: {
      hierarchy: {
        lvl0: { value: null },
        lvl1: { value: 'React' },
        lvl2: { value: 'React introduction' },
      },
    },
  },
  {
    url: 'https://markprompt.com/docs/hit',
    hierarchy: {
      lvl0: 'Heading',
      lvl1: 'React',
      lvl2: 'React introduction',
    },
    _highlightResult: {
      hierarchy: {
        lvl0: { value: 'Heading' },
        lvl1: { value: 'React' },
        lvl2: { value: 'React introduction' },
      },
    },
  },
] as AlgoliaDocSearchHit[];

describe('constants', () => {
  test('default references.getHref', () => {
    expect(DEFAULT_MARKPROMPT_OPTIONS.references?.getHref?.(results[0])).toBe(
      `${basePath}#${headingSlug}`,
    );
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references?.getHref?.(results[1]),
    ).toEqual(basePath);
  });

  test('default references.getLabel', () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references?.getLabel?.(results[0]),
    ).toEqual(heading);
    expect(DEFAULT_MARKPROMPT_OPTIONS.references?.getLabel?.(results[1])).toBe(
      'Home',
    );
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references?.getLabel?.(results[2]),
    ).toEqual(noTitleFileName);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references?.getLabel?.(results[3]),
    ).toEqual(noTitleFileName);
  });

  test('default search.getHref', () => {
    expect(DEFAULT_MARKPROMPT_OPTIONS.search?.getHref?.(results[0])).toBe(
      `${basePath}#${headingSlug}`,
    );
    expect(DEFAULT_MARKPROMPT_OPTIONS.search?.getHref?.(results[6])).toBe(
      `${urlPath}#${headingId}`,
    );
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getHref?.(algoliaSearchHits[0]),
    ).toEqual(algoliaSearchHits[0]?.url);
  });

  test('default search.getHeading', () => {
    expect(DEFAULT_MARKPROMPT_OPTIONS.search?.getHeading?.(results[0])).toEqual(
      results[0]?.file.title,
    );
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getHeading?.(results[1]),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getHeading?.(algoliaSearchHits[0]),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getHeading?.(algoliaSearchHits[1]),
    ).toEqual(algoliaSearchHits[1]?.hierarchy.lvl0);
  });

  test('default search.getTitle', () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle?.(results[0], ''),
    ).toEqual(results[0]?.meta?.leadHeading?.value);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle?.(results[1], ''),
    ).toEqual(results[1]?.file.title);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle?.(results[4], 'aute'),
    ).toEqual(loremIpsumKwicSnippet);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle?.(results[5], 'Some'),
    ).toEqual(shortContent);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle?.(algoliaSearchHits[0], ''),
    ).toEqual(algoliaSearchHits[0]?.hierarchy.lvl1);
  });

  test('default search.getSubtitle', () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getSubtitle?.(results[0]),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search?.getSubtitle?.(algoliaSearchHits[0]),
    ).toEqual(algoliaSearchHits[0]?.hierarchy.lvl2);
  });
});
