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

// biome-ignore lint/complexity/noBannedTypes: we need it to match the parameter type of isValidElement
function isObjectOrNullish(value: unknown): value is {} | null | undefined {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && !Array.isArray(value))
  );
}

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
          if (isObjectOrNullish(value) && isValidElement(value)) {
            return cloneElement(value);
          }
        }),
        defaultOptions,
      ) as U extends undefined ? T : DeepMerge<U, T>,
    [defaultOptions, options],
  );
}
