import { Fragment, forwardRef, memo, type ComponentType, useMemo } from 'react';

import { FileTextIcon, HashIcon } from '../icons.js';
import type { SearchResultProps as BaseSearchResultProps } from '../index.js';

interface HighlightMatchesProps {
  value?: string;
  match: string;
}

// Source: https://github.com/shuding/nextra/blob/main/packages/nextra-theme-docs/src/components/highlight-matches.tsx
const HighlightMatches = memo<HighlightMatchesProps>(function HighlightMatches({
  value,
  match,
}: HighlightMatchesProps) {
  if (!match || match === '') return <>{value}</>;

  const splitText = value ? value.split('') : [];
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  const regexp = RegExp(`(${escapedSearch.replaceAll(' ', '|')})`, 'ig');
  let id = 0;
  let index = 0;
  const res = [];

  if (value) {
    while (true) {
      const result = regexp.exec(value);
      if (result === null) break;
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

interface SearchResultProps extends BaseSearchResultProps {
  searchQuery: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkAs?: string | ComponentType<any>;
}

function cleanString(text: string | undefined): string | undefined {
  return text
    ?.replace(/\|/gi, '')
    .replace(/-{2,}/gi, '')
    .replace(/-{2,}/gi, '')
    .replace(/\s{2,}/gi, ' ');
}

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const {
      href,
      title,
      heading,
      subtitle,
      onMouseMove,
      onClick,
      searchQuery,
      linkAs,
      ...rest
    } = props;

    const Link = linkAs ?? 'a';

    const cleanedTitle = useMemo(() => {
      return cleanString(title);
    }, [title]);

    const cleanedSubtitle = useMemo(() => {
      return cleanString(subtitle);
    }, [subtitle]);

    return (
      <li {...rest} ref={ref} className="MarkpromptSearchResult">
        <Link
          href={href}
          onMouseMove={onMouseMove}
          onClick={onClick}
          className="MarkpromptSearchResultLink"
        >
          <div className="MarkpromptSearchResultContainer">
            <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
              {href?.includes('#') ? (
                <HashIcon className="MarkpromptSearchResultIcon" aria-hidden />
              ) : (
                <FileTextIcon
                  className="MarkpromptSearchResultIcon"
                  aria-hidden
                />
              )}
            </div>
            <div className="MarkpromptSearchResultContentWrapper">
              {heading && (
                <div className="MarkpromptSearchResultHeading">
                  <HighlightMatches value={heading} match={searchQuery} />
                </div>
              )}
              <div className="MarkpromptSearchResultTitle">
                <HighlightMatches value={cleanedTitle} match={searchQuery} />
              </div>
              {cleanedSubtitle && (
                <div className="MarkpromptSearchResultSubtitle">
                  <HighlightMatches
                    value={cleanedSubtitle}
                    match={searchQuery}
                  />
                </div>
              )}
            </div>
          </div>
        </Link>
      </li>
    );
  },
);

SearchResult.displayName = 'Markprompt.SearchResult';

export { SearchResult };
