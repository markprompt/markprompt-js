import Button from '@/components/ui/Button';
import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import cn from 'classnames';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FileDnd } from '@/components/files/FileDnd';
import { pluralize } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/dialogs/Confirm';
import Link from 'next/link';
import useTeam from '@/lib/hooks/use-team';
import useProject from '@/lib/hooks/use-project';
import useFiles from '@/lib/hooks/use-files';
import { isPresent } from 'ts-is-present';
import { deleteFiles } from '@/lib/api';
import {
  getTrainingStateMessage,
  TrainingState,
  useTrainingContext,
} from '@/lib/context/training';
import {
  getContent,
  getOwnerRepoString,
  getRepositoryMDFilesInfo,
} from '@/lib/github';

// Cf. https://github.com/iamkun/dayjs/issues/297#issuecomment-1202327426
import relativeTime from 'dayjs/plugin/relativeTime';
import { GitHubIcon } from '@/components/icons/GitHub';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
dayjs.extend(relativeTime);

const getBasePath = (pathWithFile: string) => {
  const parts = pathWithFile.split('/');
  if (parts.length <= 2) {
    return '/';
  } else {
    return parts.slice(1, -1).join('/');
  }
};

const getStatusMessage = (
  trainingState: TrainingState,
  isDeleting: boolean,
  numSelected: number,
  numFiles: number,
) => {
  if (trainingState.state === 'idle' && !isDeleting) {
    if (numSelected > 0) {
      return `${pluralize(numSelected, 'file', 'files')} selected`;
    } else {
      return `${pluralize(numFiles, 'file', 'files')} trained`;
    }
  }

  if (trainingState.state === 'loading') {
    return getTrainingStateMessage(trainingState, numFiles);
  } else if (isDeleting) {
    return `Deleting ${pluralize(numSelected, 'file', 'files')}`;
  }
};

type StatusMessageProps = {
  trainingState: TrainingState;
  isDeleting: boolean;
  numFiles: number;
  numSelected: number;
  playgroundPath: string;
};

const StatusMessage: FC<StatusMessageProps> = ({
  trainingState,
  isDeleting,
  numFiles,
  numSelected,
  playgroundPath,
}) => {
  return (
    <p
      className={cn('whitespace-nowrap text-sm text-neutral-500', {
        'animate-pulse rounded-full bg-primary-900/20 px-3 py-1 font-medium text-primary-400':
          trainingState.state === 'loading',
      })}
    >
      {getStatusMessage(trainingState, isDeleting, numSelected, numFiles)}
      {trainingState.state === 'idle' && numSelected === 0 && numFiles > 0 && (
        <Link href={playgroundPath}>
          <span className="subtle-underline ml-3 whitespace-nowrap transition hover:text-neutral-300">
            Query in playground
          </span>
        </Link>
      )}
    </p>
  );
};

const Data = () => {
  const { team } = useTeam();
  const { project } = useProject();
  const { files, mutate: mutateFiles, loading: loadingFiles } = useFiles();
  const { generateEmbeddings, state: trainingState } = useTrainingContext();
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<{
    path: string;
    updated_at: string;
  }>();

  const columns: any = useMemo(
    () => [
      columnHelper.accessor((row) => row.path, {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          );
        },
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.path, {
        id: 'name',
        header: () => <span>Name</span>,
        cell: (info) => info.getValue().split('/').slice(-1)[0],
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.path, {
        id: 'path',
        header: () => <span>Path</span>,
        cell: (info) => getBasePath(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.updated_at, {
        id: 'updated',
        header: () => <span>Updated</span>,
        cell: (info) => dayjs(info.getValue()).fromNow(),
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: files || [],
    columns,
    state: { rowSelection, sorting },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const numSelected = Object.values(rowSelection).filter(Boolean).length;
  const hasFiles = files && files.length > 0;

  return (
    <ProjectSettingsLayout
      title="Data"
      SubHeading={() => {
        if (!project?.github_repo) {
          return <></>;
        }
        return (
          <Link
            className="flex flex-row items-center gap-2 text-xs text-neutral-500 transition hover:text-neutral-400"
            href={project.github_repo}
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="h-3 w-3" />
            <p className="subtle-underline">
              {getOwnerRepoString(project.github_repo)}
            </p>
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        );
      }}
      RightHeading={() => (
        <div className="flex w-full items-center gap-4">
          <div className="flex-grow" />
          <StatusMessage
            trainingState={trainingState}
            isDeleting={isDeleting}
            numFiles={files?.length || 0}
            numSelected={numSelected}
            playgroundPath={`/${team?.slug}/${project?.slug}/playground`}
          />
          {numSelected > 0 && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button loading={isDeleting} variant="danger" buttonSize="sm">
                  Delete
                </Button>
              </Dialog.Trigger>
              <ConfirmDialog
                title={`Delete ${pluralize(numSelected, 'file', 'files')}?`}
                description="Deleting a file will remove it from all future answers."
                cta="Delete"
                variant="danger"
                loading={isDeleting}
                onCTAClick={async () => {
                  if (!project?.id) {
                    return;
                  }
                  const selectedRowIndices = Object.keys(rowSelection);
                  const rowModel = table.getSelectedRowModel().rowsById;
                  const fileIds = selectedRowIndices
                    .map((i) => rowModel[i].original.id)
                    .filter(isPresent);
                  if (fileIds.length === 0) {
                    return;
                  }
                  setIsDeleting(true);
                  await deleteFiles(project.id, fileIds);
                  await mutateFiles(
                    files?.filter((f) => !fileIds.includes(f.id)),
                  );
                  setRowSelection([]);
                  setIsDeleting(false);
                  toast.success(
                    `${pluralize(fileIds.length, 'file', 'files')} deleted.`,
                  );
                }}
              />
            </Dialog.Root>
          )}
          {numSelected === 0 && (
            <div className="flex flex-row items-center gap-2">
              {hasFiles && (
                <Button
                  disabled={trainingState.state === 'loading'}
                  variant={project?.github_repo ? 'plain' : 'cta'}
                  buttonSize="sm"
                  onClick={() => setFileDialogOpen(true)}
                >
                  Add files
                </Button>
              )}
              {project?.github_repo && (
                <Button
                  loading={trainingState.state === 'loading'}
                  variant="cta"
                  buttonSize="sm"
                  onClick={async () => {
                    if (!project.github_repo) {
                      return;
                    }
                    const mdFilesInfo = await getRepositoryMDFilesInfo(
                      project.github_repo,
                    );
                    await generateEmbeddings(
                      mdFilesInfo.length,
                      (i) => {
                        const info = mdFilesInfo[i];
                        return {
                          name: info.name,
                          path: info.path,
                          checksum: info.sha,
                        };
                      },
                      async (i) => getContent(mdFilesInfo[i].url),
                      true,
                    );
                    await mutateFiles();
                    toast.success('Processing complete');
                  }}
                >
                  Sync repo
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    >
      {!loadingFiles && !hasFiles && (
        <div className="mt-8 h-[400px] rounded-lg border border-dashed border-neutral-800 bg-neutral-1100">
          <FileDnd
            onTrainingComplete={() => {
              toast.success('Processing complete');
              setTimeout(async () => {
                setFileDialogOpen(false);
              }, 1000);
            }}
          />
        </div>
      )}
      {hasFiles && (
        <div className="max-w-full">
          <table className="mt-8 w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-neutral-800"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'cursor-pointer py-2 px-2 text-left text-sm text-neutral-300',
                          {},
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex flex-row items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.id !== 'select' && (
                              <>
                                <span className="text-sm font-normal text-neutral-600">
                                  {{
                                    asc: '↓',
                                    desc: '↑',
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-neutral-900 hover:bg-neutral-1000',
                      {
                        'bg-neutral-1000': row.getIsSelected(),
                      },
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className={cn('py-2 px-2 text-sm', {
                            'w-8': cell.column.id === 'select',
                            'truncate font-medium text-neutral-300':
                              cell.column.id === 'name',
                            'max-w-[100px] truncate text-neutral-500':
                              cell.column.id === 'path' ||
                              cell.column.id === 'updated',
                          })}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog.Root open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="animate-overlay-appear dialog-overlay" />
          <Dialog.Content className="animate-dialog-slide-in dialog-content h-[90%] max-h-[400px] w-[90%] max-w-[600px]">
            <FileDnd
              onTrainingComplete={() => {
                toast.success('Processing complete');
                setTimeout(async () => {
                  setFileDialogOpen(false);
                }, 1000);
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ProjectSettingsLayout>
  );
};

export default Data;
