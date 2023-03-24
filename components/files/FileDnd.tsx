import { FileData } from '@/types/types';
import { readTextFileAsync } from '@/lib/utils';
import cn from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import useFiles from '@/lib/hooks/use-files';
import {
  getTrainingStateMessage,
  useTrainingContext,
} from '@/lib/context/training';
import { createHash } from 'crypto';
import { ToggleMessage } from '../ui/ToggleMessage';
import { toast } from 'react-hot-toast';

type FileDndProps = {
  onTrainingComplete: () => void;
  className?: string;
};

export const FileDnd: FC<FileDndProps> = ({ onTrainingComplete }) => {
  const [pickedFiles, setPickedFiles] = useState<FileData[]>([]);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { mutate: mutateFiles } = useFiles();
  const {
    generateEmbeddings,
    state: trainingState,
    stopGeneratingEmbeddings,
  } = useTrainingContext();
  const [isTrainingInitiatedByFileDnd, setIsTrainingInitiatedByFileDnd] =
    useState(false);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    disabled: trainingState.state !== 'idle',
    noClick: true,
    noKeyboard: true,
    maxFiles: 500,
    maxSize: 900_000,
    accept: { 'text/*': ['.md', '.mdoc', '.mdx', '.txt'] },
    onDragEnter: () => {
      setDragging(true);
    },
    onDragLeave: () => {
      setDragging(false);
    },
    onDrop: () => {
      setDragging(false);
    },
  });

  useEffect(() => {
    if (acceptedFiles?.length > 0) {
      Promise.all(
        acceptedFiles.map(async (file) => {
          const content = await readTextFileAsync(file);
          return { path: (file as any).path, name: file.name, content };
        }),
      ).then(setPickedFiles);
    }
  }, [acceptedFiles]);

  const upload = useCallback(async () => {
    if (pickedFiles?.length === 0) {
      toast.error('No files selected');
      return;
    }

    setIsTrainingInitiatedByFileDnd(true);
    await generateEmbeddings(
      pickedFiles.length,
      (i) => {
        const file = pickedFiles[i];
        const content = file.content;
        return {
          name: file.name,
          path: file.path,
          checksum: createHash('sha256').update(content).digest('base64'),
        };
      },
      async (i) => pickedFiles[i].content,
      true,
    );
    setIsTrainingInitiatedByFileDnd(false);
    setPickedFiles([]);
    setTrainingComplete(true);
    mutateFiles();
    onTrainingComplete();
  }, [pickedFiles, generateEmbeddings, onTrainingComplete, mutateFiles]);

  const hasFiles = pickedFiles?.length > 0;

  return (
    <div
      className={cn(
        'relative h-full w-full rounded-lg border-2 text-sm text-neutral-300 transition duration-300',
        {
          'border-fuchsia-600 bg-fuchsia-500 bg-opacity-[3%]': dragging,
          'border-transparent': !dragging && !hasFiles,
          'border-fuchsia-600 bg-fuchsia-500 bg-opacity-[7%]': hasFiles,
        },
      )}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex h-full w-full flex-row items-center justify-center gap-2">
          <div className="relative mt-4 w-full">
            <div className="absolute inset-x-0 -top-9">
              <ToggleMessage
                showMessage1={!hasFiles}
                message1={
                  <>
                    {trainingComplete
                      ? 'Processing complete'
                      : 'Drop your files here'}
                    <span
                      className={cn(
                        'block text-center text-xs text-neutral-600',
                        {
                          'opacity-0': trainingComplete,
                        },
                      )}
                    >
                      A folder also works
                    </span>
                  </>
                }
                message2={getTrainingStateMessage(
                  trainingState,
                  pickedFiles.length,
                )}
              />
            </div>
            <Button
              className="mx-auto mt-5 min-w-[140px]"
              variant={hasFiles ? 'glow' : 'plain'}
              onClick={hasFiles ? upload : open}
              // Only show loading message if the training was initiated
              // here (as opposed to e.g. via the GitHub component).
              loading={
                trainingState.state !== 'idle' && isTrainingInitiatedByFileDnd
              }
              loadingMessage="Processing..."
            >
              {hasFiles ? 'Start training' : 'Select files'}
            </Button>
            {trainingState.state !== 'idle' && isTrainingInitiatedByFileDnd && (
              <div className="absolute -bottom-7 flex w-full justify-center">
                <p
                  className="subtle-underline cursor-pointer text-xs"
                  onClick={stopGeneratingEmbeddings}
                >
                  {trainingState.state === 'cancel_requested'
                    ? 'Cancelling...'
                    : 'Stop training'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {(trainingState.state === 'idle' || !isTrainingInitiatedByFileDnd) && (
        <p
          className={cn(
            'absolute inset-x-0 bottom-3 transform text-center text-xs text-neutral-400 transition duration-300',
            {
              'pointer-events-none opacity-50': trainingState.state !== 'idle',
              'translate-y-1 opacity-0':
                !pickedFiles || pickedFiles.length === 0,
              'translate-y-0 opacity-100': pickedFiles.length > 0,
            },
          )}
        >
          <span
            className="subtle-underline cursor-pointer transition hover:opacity-80"
            onClick={open}
          >
            Select new
          </span>{' '}
          or{' '}
          <span
            className="subtle-underline cursor-pointer transition hover:opacity-80"
            onClick={() => setPickedFiles([])}
          >
            clear files
          </span>
        </p>
      )}
    </div>
  );
};
