import type { AlgoliaDocSearchHit, SearchResult } from '@markprompt/core';
import { Source } from '@markprompt/core';
import { describe, expect, test } from 'vitest';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';

const basePath = '/docs/guides';
const filePath = `${basePath}/index.md`;
const heading = 'Heading 1';
const headingSlug = 'heading-1';
const headingId = 'generated-id';
const noTitleFileName = 'no-title';
const source: Source = { type: 'api-upload' };
const shortContent = 'Some content';

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const loremIpsumKwicSnippet =
  'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,';

const results: SearchResult[] = [
  {
    matchType: 'leadHeading',
    file: { path: filePath, source },
    meta: { leadHeading: { value: heading, slug: headingSlug } },
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/index.md`, title: 'Home', source },
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/${noTitleFileName}.md`, source },
  },
  {
    matchType: 'title',
    file: { path: `${basePath}/${noTitleFileName}`, source },
  },
  {
    matchType: 'content',
    snippet: loremIpsum,
    file: { path: `${basePath}/${noTitleFileName}`, source },
  },
  {
    matchType: 'content',
    snippet: `## ${heading}\n\n${shortContent}`,
    file: { path: `${basePath}/${noTitleFileName}`, source },
    meta: { leadHeading: { value: heading, slug: headingSlug } },
  },
  {
    matchType: 'leadHeading',
    file: { path: filePath, source },
    meta: { leadHeading: { value: heading, slug: headingSlug, id: headingId } },
  },
];

const alogliaSearchHits: AlgoliaDocSearchHit[] = [
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
];

describe('constants', () => {
  test('default references.getHref', async () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references!.getHref?.(results[0]),
    ).toEqual(`${basePath}#${headingSlug}`);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references!.getHref?.(results[1]),
    ).toEqual(basePath);
  });

  test('default references.getLabel', async () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references!.getLabel?.(results[0]),
    ).toEqual(results[0].meta?.leadHeading?.value);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references!.getLabel?.(results[2]),
    ).toEqual(noTitleFileName);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.references!.getLabel?.(results[3]),
    ).toEqual(noTitleFileName);
  });

  test('default search.getHref', async () => {
    expect(DEFAULT_MARKPROMPT_OPTIONS.search!.getHref?.(results[0])).toEqual(
      `${basePath}#${headingSlug}`,
    );
    expect(DEFAULT_MARKPROMPT_OPTIONS.search!.getHref?.(results[6])).toEqual(
      `${basePath}#${headingId}`,
    );
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getHref?.(alogliaSearchHits[0]),
    ).toEqual(alogliaSearchHits[0].url);
  });

  test('default search.getHeading', async () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading?.(results[0], ''),
    ).toEqual(results[0].file.title);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading?.(results[1], ''),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading?.(alogliaSearchHits[0], ''),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading?.(alogliaSearchHits[1], ''),
    ).toEqual(alogliaSearchHits[1].hierarchy.lvl0);
  });

  test('default search.getTitle', async () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle?.(results[0], ''),
    ).toEqual(results[0].meta?.leadHeading?.value);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle?.(results[1], ''),
    ).toEqual(results[1].file.title);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle?.(results[4], 'aute'),
    ).toEqual(loremIpsumKwicSnippet);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle?.(results[5], 'Some'),
    ).toEqual(shortContent);
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle?.(alogliaSearchHits[0], ''),
    ).toEqual(alogliaSearchHits[0].hierarchy.lvl1);
  });

  test('default search.getSubtitle', async () => {
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getSubtitle?.(results[0], ''),
    ).toBeUndefined();
    expect(
      DEFAULT_MARKPROMPT_OPTIONS.search!.getSubtitle?.(
        alogliaSearchHits[0],
        '',
      ),
    ).toEqual(alogliaSearchHits[0].hierarchy.lvl2);
  });
});
