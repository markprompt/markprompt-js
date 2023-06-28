import { clsx } from 'clsx';
import React, { Fragment, forwardRef, memo } from 'react';

import { FileTextIcon, HashIcon } from './icons.js';
import {
  useMarkpromptContext,
  getHref as getDefaultHref,
  type SearchResultProps,
} from './index.js';

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
      isParent,
      hasParent,
      getHref,
      path,
      sectionHeading,
      source,
      ...rest
    } = props;
    const { prompt } = useMarkpromptContext();

    return (
      <li
        {...rest}
        ref={ref}
        className={clsx('MarkpromptSearchResult', {
          MarkpromptSearchResultIndented: hasParent,
        })}
      >
        <a
          href={
            getHref?.(path, sectionHeading, source) ||
            getDefaultHref(path, sectionHeading)
          }
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
              {tag && (
                <div className="MarkpromptSearchResultTag">
                  <HighlightMatches value={tag} match={prompt} />
                </div>
              )}
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
