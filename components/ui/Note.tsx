import { ReactNode, FC } from 'react';
import cn from 'classnames';
import { InfoCircledIcon } from '@radix-ui/react-icons';

type NoteType = 'info' | 'warning' | 'error';

type IconProps = {
  type: NoteType;
  className?: string;
};

type NoteProps = {
  children?: ReactNode;
  type: NoteType;
};

const Icon: FC<IconProps> = ({ type, className }) => {
  switch (type) {
    default:
      return <InfoCircledIcon className={cn(className, 'text-sky-500')} />;
  }
};

export const Note: FC<NoteProps> = ({ children, type }) => {
  return (
    <div
      className={cn(
        'mb-8 flex flex-row items-start gap-4 rounded-md border border-neutral-900 bg-neutral-1000 p-4',
      )}
    >
      <Icon type={type} className="mt-1 h-5 w-5 flex-none" />
      <div className="flex-grow prose-p:my-0">{children}</div>
    </div>
  );
};
