import React, { Fragment, forwardRef, memo } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { FileTextIcon, HashIcon } from './icons.js';
import { useMarkpromptContext, type SearchResultProps } from './index.js';

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
      tag,
      getHref,
      isSection,
      reference,
      onMouseMove,
      onClick,
      ...rest
    } = props;
    const { searchQuery } = useMarkpromptContext();

    return (
      <li {...rest} ref={ref} className="MarkpromptSearchResult">
        <a
          href={
            getHref?.(reference) ||
            DEFAULT_MARKPROMPT_OPTIONS.search!.getHref?.(reference) ||
            ''
          }
          className="MarkpromptSearchResultLink"
          onMouseMove={onMouseMove}
          onClick={onClick}
        >
          <div className="MarkpromptSearchResultContainer">
            <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
              {isSection ? (
                <HashIcon className="MarkpromptSearchResultIcon" />
              ) : (
                <FileTextIcon className="MarkpromptSearchResultIcon" />
              )}
            </div>
            <div className="MarkpromptSearchResultContentWrapper">
              {tag && (
                <div className="MarkpromptSearchResultTag">
                  <HighlightMatches value={tag} match={searchQuery} />
                </div>
              )}
              <div className="MarkpromptSearchResultTitle">
                <HighlightMatches value={title} match={searchQuery} />
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
