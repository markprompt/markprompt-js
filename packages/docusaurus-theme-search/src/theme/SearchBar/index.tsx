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
        <span
          aria-label="expand searchbar"
          role="button"
          className="search-icon"
          onClick={() => openMarkprompt()}
          onKeyDown={async (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              await openMarkprompt();
            }
          }}
          tabIndex={0}
        />
        <input
          id="search_input_react"
          type="search"
          placeholder={markpromptProps.trigger?.placeholder || 'Search or ask'}
          aria-label={markpromptProps.trigger?.label || 'Search or ask'}
          className="navbar__search-input search-bar"
          onClick={() => openMarkprompt()}
        />
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
