import cloneDeepWith from 'lodash-es/cloneDeepWith.js';
import defaults from 'lodash-es/defaultsDeep.js';
import { cloneElement, isValidElement, useMemo } from 'react';

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
    () =>
      defaults(
        cloneDeepWith(options, (value) => {
          // don't clone React elements with lodash, they won't render properly after
          if (isValidElement(value)) {
            return cloneElement(value);
          }
        }),
        defaultOptions,
      ),
    [defaultOptions, options],
  );
}
