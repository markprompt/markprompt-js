/* eslint-disable @typescript-eslint/no-explicit-any */
import '@markprompt/css';

import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { type MarkpromptConfig } from '@markprompt/docusaurus-theme-search';
import type SearchBarType from '@theme/SearchBar';
import SearchBar from '@theme-original/SearchBar';
import React, { Suspense, lazy } from 'react';

// import Markprompt lazily as Docusaurus does not currently support ESM
const Markprompt = lazy(() => {
  return import('@markprompt/react').then((mod) => ({
    default: mod.Markprompt,
  }));
});

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { projectKey, ...config } = siteConfig.themeConfig
    .markprompt as MarkpromptConfig;

  const referencesConfig = {
    ...config.references,
    getHref: (reference: any) => reference.file?.path?.replace(/\.[^.]+$/, ''),
    getLabel: (reference: any) => {
      return reference.meta?.leadHeading?.value || reference.file?.title;
    },
  };

  const searchConfig = {
    ...config.search,
    getHref: (result: any) => result.url,
    getHeading: (result: any) => result.hierarchy?.lvl0,
    getTitle: (result: any) => result.hierarchy?.lvl1,
    getSubtitle: (result: any) => result.hierarchy?.lvl2,
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {/* Docusaurus' version of `ReactDOMServer` doesn't support Suspense yet, so we can only render the component on the client. */}
      {typeof window !== 'undefined' && (
        <Suspense fallback={null}>
          <Markprompt
            projectKey={projectKey}
            {...config}
            references={referencesConfig}
            search={searchConfig}
          />
        </Suspense>
      )}
      <SearchBar {...props} />
    </div>
  );
}
