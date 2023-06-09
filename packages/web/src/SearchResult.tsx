import type {
  SearchResult as TSearchResult,
  SearchResultSection as TSearchResultSection,
} from '@markprompt/core';
import type { PolymorphicComponentPropWithRef } from '@markprompt/react';
import React, {
  Fragment,
  memo,
  forwardRef,
  type ComponentPropsWithRef,
  type ElementType,
} from 'react';

import { FileTextIcon, HashIcon } from './icons.js';

type HighlightMatchesProps = {
  value?: string;
  match: string;
};

// Source: https://github.com/shuding/nextra/blob/main/packages/nextra-theme-docs/src/components/highlight-matches.tsx
const HighlightMatches = memo<HighlightMatchesProps>(function HighlightMatches({
  value,
  match,
}: HighlightMatchesProps) {
  const splitText = value ? value.split('') : [];
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  const regexp = RegExp('(' + escapedSearch.replaceAll(' ', '|') + ')', 'ig');
  let result;
  let id = 0;
  let index = 0;
  const res = [];

  if (value) {
    while ((result = regexp.exec(value)) !== null) {
      res.push(
        <Fragment key={id++}>
          {splitText.splice(0, result.index - index).join('')}
          <span className="nx-text-primary-600">
            {splitText.splice(0, regexp.lastIndex - result.index).join('')}
          </span>
        </Fragment>,
      );
      index = regexp.lastIndex;
    }
  }

  return (
    <>
      {res}
      {splitText.join('')}
    </>
  );
});

type SearchResultProps = {
  isPage?: boolean;
  path?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  score: number;
};

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { title, isPage, ...rest } = props;
    const hasParent = false;

    return (
      <li
        {...rest}
        ref={ref}
        className={`MarkpromptSearchResult ${
          hasParent ? 'MarkpromptSearchResultIndented' : ''
        }`}
      >
        <a className="MarkpromptSearchResultLink">
          <div className="MarkpromptSearchResultContainer">
            <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
              {!isPage ? (
                <HashIcon className="MarkpromptSearchResultIcon" />
              ) : (
                <FileTextIcon className="MarkpromptSearchResultIcon" />
              )}
            </div>
            <div className="MarkpromptSearchResultContentWrapper">
              <div className="MarkpromptSearchResultTitle">{title}</div>
            </div>
          </div>
        </a>
      </li>
    );
  },
);

SearchResult.displayName = 'Markprompt.SearchResult';

export { SearchResult };
