import type {
  SearchResult as TSearchResult,
  SearchResultSection as TSearchResultSection,
} from '@markprompt/core';
import type { PolymorphicComponentPropWithRef } from '@markprompt/react';
import React, { forwardRef, type ComponentPropsWithRef } from 'react';

import { FileTextIcon, HashIcon } from './icons.js';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  { result: TSearchResult }
>;

type SearchResultSectionProps = Omit<
  ComponentPropsWithRef<'li'>,
  'children'
> & {
  parentTitle: string;
  parentPath: string;
  section?: TSearchResultSection;
  hasParent?: boolean;
};

const SearchResultSection = forwardRef<HTMLLIElement, SearchResultSectionProps>(
  (props, ref) => {
    const { section, parentTitle, parentPath, hasParent, ...rest } = props;

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
            <div className="MarkpromptSearchResultIconWrapper">
              {section ? (
                <HashIcon className="MarkpromptSearchResultIcon" />
              ) : (
                <FileTextIcon className="MarkpromptSearchResultIcon" />
              )}
            </div>
            <div className="MarkpromptSearchResultContentWrapper">
              <div className="MarkpromptSearchResultTitle">{parentTitle}</div>
            </div>
          </div>
        </a>
      </li>
    );
  },
);
SearchResultSection.displayName = 'Markprompt.SearchResultSection';

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { as: Component = 'li', result, ...rest } = props;

    const topSection = result.sections.find((s) => !s.meta?.leadHeading);
    const sectionsWithHeadings = result.sections.filter(
      (s) => !!s.meta?.leadHeading,
    );

    return (
      <Component {...rest} ref={ref}>
        <article>
          <ul className="MarkpromptSearchSubResults">
            {topSection && (
              <SearchResultSection
                parentTitle={result.meta.title}
                parentPath={result.path}
              />
            )}
            {sectionsWithHeadings.map((section) => (
              <SearchResultSection
                key={section.content}
                section={section}
                parentTitle={result.meta.title}
                parentPath={result.path}
                hasParent={!!topSection}
              />
            ))}
          </ul>
        </article>
      </Component>
    );
  },
);
SearchResult.displayName = 'Markprompt.SearchResult';

export { SearchResult };
