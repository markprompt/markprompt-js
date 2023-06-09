import {
  useMarkpromptContext,
  type SearchResultProps,
  type FlattenedSearchResult,
} from '@markprompt/react';
import { clsx } from 'clsx';
import React, { Fragment, forwardRef, memo } from 'react';

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
  if (!match || match === '') return <>{value}</>;

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
          <span className="MarkpromptMatch">
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

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const {
      title,
      isParent,
      hasParent,
      path,
      score,
      getHref = (result: FlattenedSearchResult) => result.path,
      ...rest
    } = props;
    const { prompt } = useMarkpromptContext();

    return (
      <li
        {...rest}
        ref={ref}
        className={clsx(`MarkpromptSearchResult`, {
          MarkpromptSearchResultIndented: hasParent,
        })}
      >
        <a
          href={getHref(props)}
          onClick={console.log}
          className="MarkpromptSearchResultLink"
        >
          <div className="MarkpromptSearchResultContainer">
            <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
              {!isParent ? (
                <HashIcon className="MarkpromptSearchResultIcon" />
              ) : (
                <FileTextIcon className="MarkpromptSearchResultIcon" />
              )}
            </div>
            <div className="MarkpromptSearchResultContentWrapper">
              <div className="MarkpromptSearchResultTitle">
                <HighlightMatches value={title} match={prompt} />
              </div>
            </div>
          </div>
        </a>
      </li>
    );
  },
);

SearchResult.displayName = 'Markprompt.SearchResult';

export { SearchResult };
