import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaultsDeep';
import { useMemo } from 'react';

type DeepMerge<T, U> = T extends { [key: string]: unknown }
  ? U extends { [key: string]: unknown }
    ? {
        [K in keyof T | keyof U]: K extends keyof T
          ? K extends keyof U
            ? DeepMerge<T[K], U[K]>
            : T[K]
          : K extends keyof U
          ? U[K]
          : never;
      }
    : T
  : U extends undefined
  ? T extends undefined
    ? U
    : T
  : U;

// defaults only merges the first level of properties, we need to make sure that
// deeper nested properties are merged as well.
export function useDefaults<
  T extends { [key: string]: unknown },
  U extends { [key: string]: unknown } | undefined = undefined,
>(options: T, defaultOptions: U): U extends undefined ? T : DeepMerge<U, T> {
  return useMemo(
    // cloning options as defaultsDeep mutates the first argument
    () => defaults(cloneDeep(options), defaultOptions),
    [defaultOptions, options],
  );
}
