import { DEFAULT_OPTIONS } from '@markprompt/core/constants';
import type {
  AlgoliaDocSearchHit,
  SearchResult,
} from '@markprompt/core/search';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  test,
  vi,
} from 'vitest';

import { SearchView } from './SearchView.js';

let status = 200;
let results: SearchResult[] | AlgoliaDocSearchHit[] = [];
let debug: unknown;

const server = setupServer(
  http.get(`${DEFAULT_OPTIONS.apiUrl}/search`, () => {
    if (status >= 400) {
      return HttpResponse.json(
        { error: 'Server error', debug },
        { status: status },
      );
    }

    return HttpResponse.json({ data: results, debug }, { status: status });
  }),
  http.post('https://test-dsn.algolia.net/1/indexes/test/query', () => {
    return HttpResponse.json({ hits: results }, { status: status });
  }),
);

describe('SearchView', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    vi.resetAllMocks();
    server.resetHandlers();

    status = 200;
    results = [];
    debug = undefined;
  });

  afterAll(() => {
    vi.restoreAllMocks();
    server.close();
  });

  it('renders', () => {
    render(<SearchView projectKey="test-key" />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('throws without a project key', () => {
    try {
      // @ts-expect-error intentionally missing projectKey
      expect(() => render(<SearchView />)).toThrow(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <SearchView />.',
      );
    } catch {
      // nothing
    }
  });

  it('displays search queries', async () => {
    const query = 'test query';
    const user = userEvent.setup();

    results = [
      {
        file: {
          path: 'path/to/file',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
      {
        file: {
          path: 'path/to/file',
          title: 'result 1',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
      {
        file: {
          path: 'path/to/file',
          title: 'result 2',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
        meta: {
          leadHeading: {
            id: 'test-id',
          },
        },
      },
      {
        file: {
          path: 'path/to/file',
          source: { id: '0', type: 'github' },
        },
        matchType: 'leadHeading',
        meta: {
          leadHeading: {
            value: 'result 3',
            slug: 'result-3',
          },
        },
      },
      {
        file: {
          path: 'path/to/file',
          source: { id: '0', type: 'github' },
        },
        meta: {
          leadHeading: {
            value: 'result 4',
            slug: 'result-4',
          },
        },
        matchType: 'content',
        snippet: '# result 4\n snippet',
      },
    ];

    render(<SearchView projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Untitled' }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'result 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'result 2' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'result 3' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'result 4 snippet' }),
    ).toBeInTheDocument();
  });

  it('display an empty state when there are no search results', async () => {
    const query = 'testquery';
    const user = userEvent.setup();

    results = [];

    render(<SearchView projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });
  });

  test.skip(
    'allows users to select search queries',
    async () => {
      const query = 'test';
      const user = userEvent.setup();

      results = [
        {
          file: {
            path: 'path/to/file',
            source: { id: '0', type: 'github' },
          },
          matchType: 'title',
        },
        {
          file: {
            path: 'path/to/file',
            title: 'result 1',
            source: { id: '0', type: 'github' },
          },
          matchType: 'title',
        },
        {
          file: {
            path: 'path/to/file',
            title: 'result 2',
            source: { id: '0', type: 'github' },
          },
          matchType: 'title',
          meta: {
            leadHeading: {
              id: 'test-id',
            },
          },
        },
      ];

      render(<SearchView projectKey="test-key" />);

      await user.type(screen.getByRole('searchbox'), query);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: 'Untitled' }),
        ).toBeInTheDocument();
      });

      // first item selected by default
      expect(screen.getByRole('option', { selected: true })).toHaveAttribute(
        'id',
        'markprompt-result-0',
      );

      // select item on arrow down
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { selected: true })).toHaveAttribute(
        'id',
        'markprompt-result-1',
      );

      // select item on mousemove
      // From Michael: This test currently fails - it doesn't trigger
      // the mouse move event.
      // await userEvent.hover(screen.getByRole('link', { name: 'result 2' }));

      //  expect(
      //   screen.getByRole('option', { selected: true }),
      // ).toHaveAttribute('id', 'markprompt-result-2');

      // select previous on arrow up
      await user.keyboard('{ArrowUp}');
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { selected: true })).toHaveAttribute(
        'id',
        'markprompt-result-1',
      );

      // don't go past the last result
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { selected: true })).toHaveAttribute(
        'id',
        'markprompt-result-2',
      );
    },
    { retry: 3 },
  );

  it('reselects the first search result when the search query changes', async () => {
    const query = 'test query';
    const user = userEvent.setup();

    results = [
      {
        file: {
          path: 'path/to/file',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
    ];

    render(<SearchView projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Untitled' }),
      ).toBeInTheDocument();
    });

    await user.type(screen.getByRole('searchbox'), query);

    await waitFor(() => {
      expect(
        screen.queryByRole('option', { selected: true }),
      ).not.toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
  });

  it.skip('allows users to open search results', async () => {
    const query = 'test query';
    const user = userEvent.setup();

    results = [
      {
        file: {
          path: '#file',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
    ];

    render(<SearchView projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Untitled' }),
      ).toBeInTheDocument();
    });

    await user.keyboard('{Enter}');

    expect(window.location.href).toContain('#file');
  });

  it('highlights matches', async () => {
    const query = 'test';
    const user = userEvent.setup();

    results = [
      {
        file: {
          path: 'path/to/file',
          title: 'test',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
    ];

    render(<SearchView projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'test' })).toBeInTheDocument();
    });

    expect(screen.getByText('test')).toHaveClass('MarkpromptMatch');

    await user.clear(screen.getByRole('searchbox'));
    expect(screen.getByText('test')).not.toHaveClass('MarkpromptMatch');
  });

  it('can use algolia as a search provider', async () => {
    const user = userEvent.setup();
    const query = 'react';

    results = [
      {
        url: 'https://markprompt.com/docs/hit',
        hierarchy: {
          lvl0: 'React',
          lvl1: 'React introduction',
          lvl2: 'Integrate with React',
          lvl3: null,
          lvl4: null,
          lvl5: null,
          lvl6: null,
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: 'React',
              matchLevel: 'full',
              matchedWords: ['react'],
            },
            lvl1: {
              value: 'React introduction',
              matchLevel: 'partial',
              matchedWords: ['react'],
            },
          },
        },
      },
    ] as AlgoliaDocSearchHit[];

    render(
      <SearchView
        projectKey="test-key"
        searchOptions={{
          provider: {
            name: 'algolia',
            apiKey: 'test',
            appId: 'test',
            indexName: 'test',
          },
        }}
      />,
    );

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByRole('option', { selected: true }),
      ).toBeInTheDocument();
    });
  });

  it('logs debug information', async () => {
    const query = 'test query';
    const user = userEvent.setup();

    results = [
      {
        file: {
          path: 'path/to/file',
          source: { id: '0', type: 'github' },
        },
        matchType: 'title',
      },
    ];

    debug = {
      query,
      results,
      timing: 100.7,
    };

    // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    render(<SearchView debug projectKey="test-key" />);

    await user.type(screen.getByRole('searchbox'), query);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Untitled' }),
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(debug, null, 2));
  });
});
