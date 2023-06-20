import type { Source } from '@markprompt/core';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// This is the first reusable type utility we built
export type PolymorphicComponentProp<
  C extends ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {},
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// This is a new type utility with ref!
export type PolymorphicComponentPropWithRef<
  C extends ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// This is the type for the "ref" only
export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>['ref'];

export type SectionHeading = {
  value: string | undefined;
  id: string | undefined;
};

export type SearchResultWithMetadata = {
  isParent: boolean;
  hasParent: boolean;
  path: string;
  sectionHeading?: SectionHeading | undefined;
  score: number;
  tag?: string;
  title: string;
  source: Source;
};
