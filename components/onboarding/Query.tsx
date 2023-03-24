import { FC, ReactNode, useState } from 'react';
import cn from 'classnames';
import { Code } from '../ui/Code';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { copyToClipboard, pluralize } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Playground } from '../files/Playground';
import useFiles from '@/lib/hooks/use-files';
import useTeam from '@/lib/hooks/use-team';
import useProject from '@/lib/hooks/use-project';

const npmCode = `
npm install markprompt
`.trim();

const reactCode = (teamSlug: string, projectSlug: string) =>
  `
// Use on whitelisted domain
import { Markprompt } from "markprompt"

<Markprompt
  project="${teamSlug}/${projectSlug}" />
`.trim();

type QueryProps = {
  goBack: () => void;
  didCompleteFirstQuery: () => void;
  isReady?: boolean;
};

const Query: FC<QueryProps> = ({ goBack, didCompleteFirstQuery, isReady }) => {
  const { team } = useTeam();
  const { project } = useProject();
  const { files } = useFiles();
  const [showCode, setShowCode] = useState(false);

  if (!team || !project) {
    return <></>;
  }

  return (
    <div className="pt-12">
      <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center gap-2 p-8 pt-20 text-neutral-300">
        <p className="font-medium">Step 2: Query docs</p>
        <p className="text-center text-sm text-neutral-600">
          Trained on {pluralize(files?.length || 0, 'file', 'files')}.{' '}
          <span
            onClick={goBack}
            className="cursor-pointer border-b border-dashed dark:border-neutral-800"
          >
            Add more files
          </span>
        </p>
        <div className="mt-4 flex w-full flex-col items-center gap-4">
          <div
            className={cn('flip group h-[400px] w-full', {
              flipped: showCode,
            })}
          >
            <div className="flip-content">
              <div
                className="flip-front rounded-lg border border-dashed bg-neutral-1000 px-8 py-4 dark:border-neutral-800"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Playground
                  didCompleteFirstQuery={didCompleteFirstQuery}
                  autoScrollDisabled={!isReady}
                  iDontKnowMessage={
                    'Sorry, I am not sure how to answer that. But we are all set training your files!'
                  }
                />
              </div>
              <div className="flip-back flex flex-col justify-center divide-neutral-900 rounded-lg border border-dashed bg-neutral-900/50 p-12 text-sm dark:border-neutral-800">
                <div className="relative flex">
                  <span className="absolute left-1 flex h-full select-none items-center font-mono text-neutral-700">
                    $
                  </span>
                  <Code language="bash" code={npmCode} />
                  <div className="absolute right-2 flex h-full items-center">
                    <div
                      className="cursor-pointer rounded p-2 transition dark:hover:bg-neutral-900"
                      onClick={() => {
                        copyToClipboard(npmCode);
                        toast.success('Copied!');
                      }}
                    >
                      <ClipboardIcon className="h-4 w-4 text-neutral-500" />
                    </div>
                  </div>
                </div>
                <div className="my-4 h-px w-full border-t bg-neutral-700" />
                <div className="relative flex">
                  <Code
                    language="jsx"
                    code={reactCode(team.slug, project.slug)}
                  />
                  <div className="absolute right-2 top-9">
                    <div
                      className="cursor-pointer rounded p-2 transition dark:hover:bg-neutral-900"
                      onClick={() => {
                        copyToClipboard(reactCode(team.slug, project.slug));
                        toast.success('Copied!');
                      }}
                    >
                      <ClipboardIcon className="h-4 w-4 text-neutral-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto -mt-2 flex flex-row items-center gap-2">
            <p
              className={cn('cursor-pointer px-2 py-1 text-xs transition ', {
                'text-neutral-300': !showCode,
                'text-neutral-600': showCode,
              })}
              onClick={() => setShowCode(false)}
            >
              Playground
            </p>
            <p
              className={cn('cursor-pointer px-2 py-1 text-xs transition ', {
                'text-neutral-300': showCode,
                'text-neutral-600': !showCode,
              })}
              onClick={() => setShowCode(true)}
            >
              Code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;
