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

type SearchResultProps = {
  index: number;
  section?: TSearchResultSection;
  pageTitle: string;
  pagePath: string;
  indented?: boolean;
};

type SearchResultData = {
  isPage: boolean;
  path?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  score: number;
};

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

const SearchResult: React.ForwardRefRenderFunction<
  HTMLLIElement,
  SearchResultData
> = ({ title, isPage, ...rest }, ref) => {
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
};

// const SearchResult: React.ForwardRefRenderFunction<
//   HTMLLIElement,
//   SearchResultProps
// > = forwardRef(
//   ({ section, parentTitle, parentPath, hasParent, ...rest }, ref) => {
//     return (
//       <li
//         {...rest}
//         ref={ref}
//         className={`MarkpromptSearchResult ${
//           hasParent ? 'MarkpromptSearchResultIndented' : ''
//         }`}
//       >
//         <a className="MarkpromptSearchResultLink">
//           <div className="MarkpromptSearchResultContainer">
//             <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
//               {section ? (
//                 <HashIcon className="MarkpromptSearchResultIcon" />
//               ) : (
//                 <FileTextIcon className="MarkpromptSearchResultIcon" />
//               )}
//             </div>
//             <div className="MarkpromptSearchResultContentWrapper">
//               <div className="MarkpromptSearchResultTitle">{parentTitle}</div>
//             </div>
//           </div>
//         </a>
//       </li>
//     );
//   },
// );

// // type SearchResultProps = PolymorphicComponentPropWithRef<
// //   'li',
// //   { result: TSearchResult }
// // >;

// type SearchResultSectionProps = Omit<
//   ComponentPropsWithRef<'li'>,
//   'children'
// > & {
//   parentTitle: string;
//   parentPath: string;
//   section?: TSearchResultSection;
//   hasParent?: boolean;
// };

// const SearchResultSection = forwardRef<HTMLLIElement, SearchResultSectionProps>(
//   (props, ref) => {
//     const { section, parentTitle, parentPath, hasParent, ...rest } = props;

//     return (
//       <li
//         {...rest}
//         ref={ref}
//         className={`MarkpromptSearchResult ${
//           hasParent ? 'MarkpromptSearchResultIndented' : ''
//         }`}
//       >
//         <a className="MarkpromptSearchResultLink">
//           <div className="MarkpromptSearchResultContainer">
//             <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
//               {section ? (
//                 <HashIcon className="MarkpromptSearchResultIcon" />
//               ) : (
//                 <FileTextIcon className="MarkpromptSearchResultIcon" />
//               )}
//             </div>
//             <div className="MarkpromptSearchResultContentWrapper">
//               <div className="MarkpromptSearchResultTitle">{parentTitle}</div>
//             </div>
//           </div>
//         </a>
//       </li>
//     );
//   },
// );
// SearchResultSection.displayName = 'Markprompt.SearchResultSection';

// // type SearchResultProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
// //   parentTitle: string;
// //   parentPath: string;
// //   section?: TSearchResultSection;
// //   hasParent?: boolean;
// // };

// // type SearchResultProps = PolymorphicComponentPropWithRef<
// //   'li',
// //   { section: TSearchResultSection; pageTitle: string; pagePath: string }
// // >;
// // const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
// //   (props, ref) => {
// //     const { as: Component = 'li', result, ...rest } = props;

// //     return (
// //       <SearchResultSection
// //         key={section.content}
// //         section={section}
// //         parentTitle={result.meta.title}
// //         parentPath={result.path}
// //         hasParent={!!topSection}
// //       />
// //     );
// //     // const topSection = result.sections.find((s) => !s.meta?.leadHeading);
// //     // const sectionsWithHeadings = result.sections.filter(
// //     //   (s) => !!s.meta?.leadHeading,
// //     // );

// //     // return (
// //     //   <Component {...rest} ref={ref}>
// //     //     <article>
// //     //       <ul className="MarkpromptSearchSubResults">
// //     //         {topSection && (
// //     //           <SearchResultSection
// //     //             parentTitle={result.meta.title}
// //     //             parentPath={result.path}
// //     //           />
// //     //         )}
// //     //         {sectionsWithHeadings.map((section) => (
// //     //           <SearchResultSection
// //     //             key={section.content}
// //     //             section={section}
// //     //             parentTitle={result.meta.title}
// //     //             parentPath={result.path}
// //     //             hasParent={!!topSection}
// //     //           />
// //     //         ))}
// //     //       </ul>
// //     //     </article>
// //     //   </Component>
// //     // );
// //   },
// // );
// // SearchResult.displayName = 'Markprompt.SearchResult';

// // type SearchResultProps = any;
// // type SearchResultProps = PolymorphicComponentPropWithRef<
// //   'li',
// //   {
// //     index: number;
// //     section?: TSearchResultSection;
// //     pageTitle: string;
// //     pagePath: string;
// //     indented?: boolean;
// //   }
// // >;

// // type SearchResultComponent = ElementType<{
// //   index: number;
// //   section?: TSearchResultSection;
// //   pageTitle: string;
// //   pagePath: string;
// //   indented?: boolean;
// // }>;

// // const SearchResult = forwardRef<any, any>(() => {
// //   return <div>Hello</div>;
// // });

// // const SearchResult1 = forwardRef<HTMLLIElement, SearchResultProps>(
// //   (props, ref) => {
// //     // const { section, pageTitle, pagePath, indented, ...rest } = props;

// //     return <div>Ok</div>;
// //     // return (
// //     //   <SearchResultSection
// //     //     key={section.content}
// //     //     section={section}
// //     //     parentTitle={pageTitle}
// //     //     parentPath={pagePath}
// //     //     hasParent={indented}
// //     //   />
// //     //   // <SearchResultSection
// //     //   //   {...rest}
// //     //   //   ref={ref}
// //     //   //   key={section.content}
// //     //   //   section={section}
// //     //   //   pageTitle={pageTitle}
// //     //   //   pagePath={pagePath}
// //     //   // />
// //     // );
// //     // return (
// //     //   <Component {...rest} ref={ref}>
// //     //     <article>
// //     //       <ul>
// //     //         {result.sections.map((section) => (
// //     //           <SearchResultSection
// //     //             key={section.content}
// //     //             section={section}
// //     //             pageTitle={result.meta.title}
// //     //             pagePath={result.path}
// //     //           />
// //     //         ))}
// //     //       </ul>
// //     //     </article>
// //     //   </Component>
// //     // );
// //   },
// // );

// type SearchResultProps = PolymorphicComponentPropWithRef<
//   'li',
//   { section: TSearchResultSection; pageTitle: string; pagePath: string }
// >;
// const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
//   (props, ref) => {
//     const { section, pageTitle, pagePath, ...rest } = props;

//     return <div>Ok</div>;
//     // return (
//     //   <SearchResultSection
//     //     {...rest}
//     //     ref={ref}
//     //     key={section.content}
//     //     section={section}
//     //     pageTitle={pageTitle}
//     //     pagePath={pagePath}
//     //   />
//     // );
//     // return (
//     //   <Component {...rest} ref={ref}>
//     //     <article>
//     //       <ul>
//     //         {result.sections.map((section) => (
//     //           <SearchResultSection
//     //             key={section.content}
//     //             section={section}
//     //             pageTitle={result.meta.title}
//     //             pagePath={result.path}
//     //           />
//     //         ))}
//     //       </ul>
//     //     </article>
//     //   </Component>
//     // );
//   },
// );

SearchResult.displayName = 'Markprompt.SearchResult';

export { SearchResult };
