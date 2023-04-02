// Node-dependent utilities. Cannot run on edge runtimes.
import fs, { promises as promisesFs } from 'fs';
import unzip from 'unzipper';
import grayMatter from 'gray-matter';
import yaml from 'js-yaml';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { FileData } from '@/types/types';
import type { Readable } from 'node:stream';
import { shouldIncludeFileWithPath } from './utils';

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

export const extractFileDataEntriesFromZip = async (
  path: string,
): Promise<FileData[]> => {
  const filesWithPath: FileData[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(unzip.Parse())
      .on('entry', async (entry: any) => {
        if (entry.type !== 'File' || !shouldIncludeFileWithPath(entry.path)) {
          // Ignore dotfiles, e.g. '.DS_Store'
          return;
        }
        const content = await entry.buffer();
        filesWithPath.push({
          path: entry.path,
          name: entry.path.split('/').slice(-1)[0],
          content: content.toString(),
        });
        entry.autodrain();
      })
      .on('error', reject)
      .on('finish', resolve);
  });

  return filesWithPath;
};

export const getBufferFromReadable = async (readable: Readable) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};
