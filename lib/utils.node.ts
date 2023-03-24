// Node-dependent utilities. Cannot run on edge runtimes.
import grayMatter from 'gray-matter';
import yaml from 'js-yaml';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

export const extractFrontmatter = (
  source: string,
): { [key: string]: string } => {
  try {
    const matter = grayMatter(source, {})?.matter;
    if (matter) {
      return yaml.load(matter, {
        schema: yaml.JSON_SCHEMA,
      }) as { [key: string]: string };
    }
  } catch {
    // Do nothing
  }
  return {};
};

export const useDebouncedState = <T>(
  initialValue: T,
  timeout: number,
  options?: any,
): [T, (value: T) => void] => {
  const [currentValue, setCurrrentValue] = useState<T>(initialValue);
  const [newValue, setNewValue] = useState<T>(initialValue);
  const debouncer = useRef<(value: T, setValue: (value: T) => void) => void>();

  useEffect(() => {
    const debounceWrapper = debounce(
      (value: T, setValue: (value: T) => void) => {
        setValue(value);
      },
      timeout,
      options,
    );
    debouncer.current = debounceWrapper;

    return () => {
      debounceWrapper.cancel();
    };
  }, [options, timeout]);

  useEffect(() => {
    debouncer.current && debouncer.current(newValue, setCurrrentValue);
  }, [newValue]);

  return [currentValue, setNewValue];
};
