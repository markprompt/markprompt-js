import type { ForwardedRef } from 'react';

declare module 'react' {
  /**
   * ForwardRef augmented with generics for type inference.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface ForwardRef<T, P = {}> {
    (props: P, ref: ForwardedRef<T>): (
      props: P & RefAttributes<T>,
    ) => ReactElement | null;
    displayName?: string;
  }

  export const forwardRef: ForwardRef<unknown, unknown>;
}
