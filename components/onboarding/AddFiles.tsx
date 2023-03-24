import { FileDnd } from '@/components/files/FileDnd';
import { Code } from '@/components/ui/Code';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { copyToClipboard, getHost, getOrigin, pluralize } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { FC, ReactNode } from 'react';
import cn from 'classnames';
import useFiles from '@/lib/hooks/use-files';
import useTokens from '@/lib/hooks/use-tokens';
import { GitHub } from '../files/GitHub';

type TagProps = {
  children: ReactNode;
  className?: string;
  variant?: 'fuchsia' | 'sky';
};

const Tag: FC<TagProps> = ({ className, variant, children }) => {
  return (
    <span
      className={cn(
        className,
        'rounded-full px-1.5 py-0.5 text-xs font-medium',
        {
          'bg-fuchsia-900/30 text-fuchsia-500': variant === 'fuchsia',
          'bg-sky-500/10 text-sky-500': variant === 'sky',
        },
      )}
    >
      {children}
    </span>
  );
};

type AddFilesProps = {
  onTrainingComplete: () => void;
  onNext: () => void;
};

const AddFiles: FC<AddFilesProps> = ({ onTrainingComplete, onNext }) => {
  const { files } = useFiles();
  const { tokens } = useTokens();

  const curlCode = `
  curl -d @docs.zip \\
    https://api.${getHost()}/generate-embeddings \\
    -H "Authorization: Bearer ${tokens?.[0]?.value || '<TOKEN>'}"
  `.trim();

  return (
    <div className="pt-12">
      <div className="mx-auto flex w-full max-w-screen-sm flex-col items-center justify-center gap-2 p-8 pt-20 text-neutral-300">
        <p className="font-medium">Step 1: Import files</p>
        <p className="mt-1 text-sm text-neutral-500">
          Accepted: <Tag variant="fuchsia">.md</Tag>
          <Tag variant="fuchsia" className="ml-1.5">
            .mdoc
          </Tag>
          <Tag variant="fuchsia" className="ml-1.5">
            .mdx
          </Tag>
          <Tag variant="fuchsia" className="ml-1.5">
            .txt
          </Tag>
        </p>
        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <div className="h-[160px] w-full rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50">
            <GitHub onTrainingComplete={onTrainingComplete} />
          </div>
          <p className="text-sm text-neutral-400">or</p>
          <div className="h-[160px] w-full rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50">
            <FileDnd onTrainingComplete={onTrainingComplete} />
          </div>
          <p className="text-sm text-neutral-400">or</p>
          <div className="relative w-full rounded-lg border border-dashed bg-neutral-900/50 py-4 dark:border-neutral-800">
            <div
              className="absolute right-2 top-2 cursor-pointer rounded p-2 transition dark:hover:bg-neutral-900"
              onClick={() => {
                copyToClipboard(curlCode);
                toast.success('Copied!');
              }}
            >
              <ClipboardIcon className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="hidden-scrollbar w-full overflow-x-auto px-8">
              <Code
                className="hidden-scrollbar mx-auto w-[480px] overflow-x-auto py-2 text-sm"
                language="bash"
                code={curlCode}
              />
            </div>
          </div>
          <p
            className={cn(
              'mt-4 transform cursor-pointer text-center text-sm text-neutral-600 transition duration-500 hover:text-neutral-400',
              {
                'translate-y-2 opacity-0': files?.length === 0,
                'translate-y-0 opacity-100': !files || files?.length > 0,
              },
            )}
            onClick={() => onNext()}
          >
            {pluralize(files?.length || 0, 'file', 'files')} ready. Go to
            playground →
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFiles;
