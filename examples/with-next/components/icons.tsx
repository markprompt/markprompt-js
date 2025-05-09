import type { ComponentPropsWithoutRef, JSX } from 'react';

const SearchIcon = (props: ComponentPropsWithoutRef<'svg'>): JSX.Element => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label/hidden via props
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

export { SearchIcon };
