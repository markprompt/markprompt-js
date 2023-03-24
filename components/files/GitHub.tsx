import cn from 'classnames';
import { FC, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { pluralize } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import {
  getContent,
  getRepositoryMDFilesInfo,
  isGitHubRepoAccessible,
} from '@/lib/github';
import { ToggleMessage } from '../ui/ToggleMessage';
import {
  getTrainingStateMessage,
  TrainingState,
  useTrainingContext,
} from '@/lib/context/training';
import useProjects from '@/lib/hooks/use-projects';
import useProject from '@/lib/hooks/use-project';
import { updateProject } from '@/lib/api';
import useFiles from '@/lib/hooks/use-files';

type GitHubProps = {
  onTrainingComplete: () => void;
  className?: string;
};

type GitHubStateIdle = { state: 'idle' };
type GitHubStateChecking = { state: 'checking' };
type GitHubStateInaccessible = { state: 'inaccessible' };
type GitHubStateNoFile = { state: 'no_files' };
type GitHubStateReady = { state: 'ready'; numFiles: number };
type GitHubStateFetchingData = { state: 'fetching_gh_data' };
type GitHubStateTrainingComplete = { state: 'training_complete' };

type GitHubState =
  | GitHubStateIdle
  | GitHubStateChecking
  | GitHubStateInaccessible
  | GitHubStateNoFile
  | GitHubStateReady
  | GitHubStateFetchingData
  | GitHubStateTrainingComplete;

const getNotReadyMessage = (gitHubState: GitHubState) => {
  if (gitHubState.state === 'inaccessible') {
    return (
      <span className="text-rose-600">
        This repository is not publicly accessible
      </span>
    );
  } else if (gitHubState.state === 'no_files') {
    return (
      <span className="text-amber-500">
        No Markdown files found in repository
      </span>
    );
  }
  return 'Import public GitHub repository';
};

const getReadyMessage = (
  gitHubState: GitHubState,
  trainingState: TrainingState,
) => {
  if (trainingState.state === 'idle') {
    if (gitHubState.state === 'ready') {
      return `${pluralize(
        gitHubState.numFiles,
        'Markdown file',
        'Markdown files',
      )} found`;
    } else if (gitHubState.state === 'fetching_gh_data') {
      return 'Fetching Markdown files...';
    }
  }
  return getTrainingStateMessage(trainingState);
};

export const GitHub: FC<GitHubProps> = ({ onTrainingComplete }) => {
  const { projects, mutate: mutateProjects } = useProjects();
  const { project, mutate: mutateProject } = useProject();
  const { mutate: mutateFiles } = useFiles();
  const {
    generateEmbeddings,
    state: trainingState,
    stopGeneratingEmbeddings,
  } = useTrainingContext();
  const [githubUrl, setGitHubUrl] = useState('');
  const [gitHubState, setGitHubState] = useState<GitHubState>({
    state: 'idle',
  });
  const [isTrainingInitiatedByGitHub, setIsTrainingInitiatedByGitHub] =
    useState(false);

  const checkRepo = useDebouncedCallback(async (url) => {
    if (!url) {
      setGitHubState({ state: 'idle' });
      return;
    }

    setGitHubState({ state: 'checking' });

    const isAccessible = await isGitHubRepoAccessible(url);
    if (isAccessible) {
      const files = await getRepositoryMDFilesInfo(url);
      if (!files || files.length === 0) {
        setGitHubState({ state: 'no_files' });
      } else {
        setGitHubState({ state: 'ready', numFiles: files.length });
      }
    } else {
      setGitHubState({ state: 'inaccessible' });
    }
  }, 500);

  const isReady =
    gitHubState.state === 'ready' || gitHubState.state === 'fetching_gh_data';

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center rounded-lg border-2 p-8 text-sm text-neutral-300 transition duration-300',
        {
          'border-transparent': !isReady,
          'border-fuchsia-600 bg-fuchsia-500 bg-opacity-[7%]': isReady,
        },
      )}
    >
      <div className="relative mt-8 flex w-full max-w-md flex-col gap-4">
        <div className="absolute inset-x-0 -top-12">
          <ToggleMessage
            showMessage1={!isReady}
            message1={getNotReadyMessage(gitHubState)}
            message2={getReadyMessage(gitHubState, trainingState)}
          />
        </div>
        <div className="relative flex flex-row gap-2">
          <Input
            className="w-full"
            value={githubUrl}
            variant={isReady ? 'glow' : 'plain'}
            type="text"
            onChange={(e: any) => {
              setGitHubUrl(e.target.value);
              checkRepo(e.target.value);
            }}
            placeholder="Enter URL"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
          <Button
            disabled={!isReady}
            variant={isReady ? 'glow' : 'plain'}
            loading={
              gitHubState.state === 'checking' ||
              (trainingState.state !== 'idle' && isTrainingInitiatedByGitHub)
            }
            loadingMessage={
              gitHubState.state === 'checking' ? 'Checking...' : 'Processing...'
            }
            onClick={async () => {
              if (!projects || !project?.id || !githubUrl) {
                return;
              }
              setIsTrainingInitiatedByGitHub(true);
              const values = { github_repo: githubUrl };
              const updatedProject = { ...project, ...values };
              setGitHubState({ state: 'fetching_gh_data' });
              await mutateProject(updateProject(project.id, values), {
                optimisticData: updatedProject,
                rollbackOnError: true,
                populateCache: true,
                revalidate: false,
              });
              await mutateProjects([
                ...projects.filter((p) => p.id !== updatedProject.id),
                updatedProject,
              ]);
              const mdFilesInfo = await getRepositoryMDFilesInfo(githubUrl);
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
              setIsTrainingInitiatedByGitHub(false);
              onTrainingComplete();
              setGitHubState({ state: 'idle' });
            }}
          >
            Start training
          </Button>
        </div>
        {trainingState.state !== 'idle' && isTrainingInitiatedByGitHub && (
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
  );
};
