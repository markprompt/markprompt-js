import '@markprompt/css';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Markprompt, type MarkpromptProps } from '@markprompt/react';
import React, { type ReactElement } from 'react';

export default function SearchBar(): ReactElement {
  const { siteConfig } = useDocusaurusContext();

  const markpromptProps = siteConfig.themeConfig.markprompt as MarkpromptProps;

  return <Markprompt {...markpromptProps} />;
}
