import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { markprompt } from '@markprompt/web';
import type SearchBarType from '@theme/SearchBar';
import SearchBar from '@theme-original/SearchBar';
import React, { useEffect } from 'react';

import '@markprompt/css';

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const { projectKey, ...config } = siteConfig.themeConfig.markprompt as any;
    markprompt(projectKey, '#markprompt', {
      ...config,
      references: {
        transformReferenceId: (referenceId) => {
          // Sample code that transforms a reference path to a link.
          // Remove file extension
          const href = referenceId.replace(/\.[^.]+$/, '');
          // Use last part of path for label
          const text = href.split('/').slice(-1)[0];
          return { text, href };
        },
      },
    });
  }, [siteConfig.themeConfig.markprompt]);

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div id="markprompt" />
      <SearchBar {...props} />
    </div>
  );
}
