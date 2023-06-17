import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import type SearchBarType from '@theme/SearchBar';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): JSX.Element {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      Test
      <SearchBar {...props} />
    </div>
  );
}
