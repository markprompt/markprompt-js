import '@markprompt/css';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  Markprompt,
  type MarkpromptProps,
  openMarkprompt,
} from '@markprompt/react';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';

declare global {
  interface Window {
    markpromptConfigExtras?: {
      references?: MarkpromptProps['references'];
      search?: MarkpromptProps['search'];
    };
  }
}

export default function SearchBar(): JSX.Element {
  const [markpromptExtras, setMarkpromptExtras] = useState<{
    references?: MarkpromptProps['references'];
    search?: MarkpromptProps['search'];
  }>({});
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setMarkpromptExtras(window.markpromptConfigExtras || {});
  }, []);

  const markpromptConfigProps = siteConfig.themeConfig
    .markprompt as MarkpromptProps;
  const markpromptProps = {
    ...markpromptConfigProps,
    references: {
      ...markpromptConfigProps.references,
      ...markpromptExtras.references,
    },
    search: {
      ...markpromptConfigProps.search,
      ...markpromptExtras.search,
    },
  };

  if (markpromptProps.trigger?.floating) {
    return <Markprompt {...markpromptProps} />;
  }

  return (
    <>
      <div id="markprompt" />
      <div className="navbar__search" key="search-box">
        <button
          id="search_input_react"
          type="button"
          aria-label={markpromptProps.trigger?.label || 'Search or ask'}
          className="navbar__search-input search-bar"
          onClick={() => openMarkprompt()}
          style={{
            textAlign: 'left',
          }}
        >
          {markpromptProps.trigger?.placeholder || 'Search or ask'}
        </button>
        <Markprompt
          {...markpromptProps}
          trigger={{
            ...markpromptProps.trigger,
            customElement: true,
          }}
        />
      </div>
    </>
  );
}
