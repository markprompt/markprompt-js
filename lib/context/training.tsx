import { FileData, ProjectChecksums } from '@/types/types';
import { createHash } from 'crypto';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  deleteAllFiles,
  getChecksums,
  setChecksums,
  processFile,
} from '../api';
import useProject from '../hooks/use-project';
import { pluralize, truncate } from '../utils';

type IdleState = { state: 'idle' };
type LoadingState = {
  state: 'loading';
  progress?: number;
  total?: number;
  filename?: string;
  message?: string;
};
type CancelRequestsState = { state: 'cancel_requested' };
type CompleteState = { state: 'complete'; errors: string[] };

export type TrainingState =
  | IdleState
  | LoadingState
  | CancelRequestsState
  | CompleteState;

export type State = {
  state: TrainingState;
  errors: string[];
  generateEmbeddings: (
    numFiles: number,
    getFileMeta: (
      index: number,
    ) => Pick<FileData, 'name' | 'path'> & { checksum: string },
    getFileContent: (index: number) => Promise<string>,
    append: boolean,
    forceRetrain?: boolean,
  ) => Promise<void>;
  stopGeneratingEmbeddings: () => void;
};

const initialState: State = {
  state: { state: 'idle' },
  errors: [],
  generateEmbeddings: async () => {},
  stopGeneratingEmbeddings: () => {},
};

export const getTrainingStateMessage = (
  state: TrainingState,
  numFiles?: number,
) => {
  if (state.state === 'loading') {
    return `Processing file ${state.progress} of ${state.total}${
      state.filename ? ` (${truncate(state.filename, 20)})` : '.'
    }`;
  } else if (state.state === 'complete') {
    return 'Done processing files.';
  } else if (state.state === 'cancel_requested') {
    return 'Stopping processing...';
  }
  if (typeof numFiles !== 'undefined') {
    return `${pluralize(numFiles, 'file', 'files')} added.`;
  }
  return '';
};

const TrainingContextProvider = (props: PropsWithChildren) => {
  const { project } = useProject();
  const [state, setState] = useState<TrainingState>({ state: 'idle' });
  const [errors, setErrors] = useState<string[]>([]);
  const stopFlag = useRef(false);

  const generateEmbeddings = useCallback(
    async (
      numFiles: number,
      getFileMeta: (
        index: number,
      ) => Pick<FileData, 'name' | 'path'> & { checksum: string },
      getFileContent: (index: number) => Promise<string>,
      append: boolean,
      forceRetrain = false,
    ) => {
      if (!project?.id) {
        return;
      }

      setErrors([]);

      if (!append) {
        await deleteAllFiles(project.id);
      }

      let updatedChecksums: ProjectChecksums = {};

      const checksums: { [key: FileData['path']]: string } = await getChecksums(
        project.id,
      );

      for (let i = 0; i < numFiles; i++) {
        if (stopFlag.current) {
          stopFlag.current = false;
          break;
        }

        // Only pick the metadata, not the full file content, since this
        // could be an expensive operation (GitHub) that might not be
        // needed if the checksums match.
        const fileMeta = getFileMeta(i);

        setState({
          state: 'loading',
          progress: i + 1,
          total: numFiles,
          filename: fileMeta.name,
        });

        // Check the checksum (or SHA if GitHub file), and skip if equals.
        if (!forceRetrain && checksums[fileMeta.path] === fileMeta.checksum) {
          updatedChecksums[fileMeta.path] = fileMeta.checksum;
          console.info('Skipping', fileMeta.path);
          continue;
        }

        console.info('Processing', fileMeta.path);

        const content = await getFileContent(i);
        const file = { ...fileMeta, content };

        try {
          await processFile(project.id, file, forceRetrain);
          updatedChecksums[file.path] = fileMeta.checksum;
        } catch (e) {
          console.error('Error', e);
          setErrors((errors) => [
            ...errors,
            `Error processing ${file.name}: ${e}`,
          ]);
        }
      }

      if (append) {
        // Keep the old checksums if this is an 'append' training.
        updatedChecksums = {
          ...checksums,
          ...updatedChecksums,
        };
      }

      await setChecksums(project.id, updatedChecksums);

      setState({ state: 'idle' });
    },
    [project?.id],
  );

  const stopGeneratingEmbeddings = useCallback(() => {
    stopFlag.current = true;
    setState({ state: 'cancel_requested' });
  }, []);

  return (
    <TrainingContext.Provider
      value={{
        state,
        errors,
        generateEmbeddings,
        stopGeneratingEmbeddings,
      }}
      {...props}
    />
  );
};

export const useTrainingContext = (): State => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error(
      `useTrainingContext must be used within a TrainingContextProvider`,
    );
  }
  return context;
};

export const TrainingContext = createContext<State>(initialState);

TrainingContext.displayName = 'TrainingContext';

export const ManagedTrainingContext: FC<PropsWithChildren> = ({ children }) => (
  <TrainingContextProvider>{children}</TrainingContextProvider>
);
