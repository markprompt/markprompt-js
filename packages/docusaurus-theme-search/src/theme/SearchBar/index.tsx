import '@markprompt/css';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  Markprompt,
  type MarkpromptProps,
  openMarkprompt,
} from '@markprompt/react';
import React, { type ReactElement } from 'react';

export default function SearchBar(): ReactElement {
  const { siteConfig } = useDocusaurusContext();

  const markpromptProps = siteConfig.themeConfig.markprompt as MarkpromptProps;

  if (markpromptProps.trigger?.floating) {
    return <Markprompt {...markpromptProps} />;
  } else {
    return (
      <>
        <div id="markprompt" />
        <div className="navbar__search" key="search-box">
          <span
            aria-label="expand searchbar"
            role="button"
            className="search-icon"
            onClick={openMarkprompt}
            tabIndex={0}
          />
          <input
            id="search_input_react"
            type="search"
            placeholder={
              markpromptProps.trigger?.placeholder || 'Search or ask'
            }
            aria-label={markpromptProps.trigger?.label || 'Search or ask'}
            className="navbar__search-input search-bar"
            onClick={openMarkprompt}
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
}
