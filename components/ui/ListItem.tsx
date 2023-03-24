import { ReactNode } from 'react';
import { CheckIcon } from '@/components/icons/Check';
import cn from 'classnames';

export const ListItem = ({
  size = 'base',
  variant,
  children,
}: {
  size?: 'sm' | 'base';
  variant?: 'discreet';
  children: ReactNode;
}) => {
  return (
    <li
      className={cn('flex w-full items-center', {
        'space-x-3 md:space-x-4': size === 'base',
        'space-x-2 md:space-x-3': size === 'sm',
      })}
    >
      {variant === 'discreet' && (
        <CheckIcon className="h-3 w-3 text-neutral-500" />
      )}
      {variant !== 'discreet' && (
        <div className="h-4 w-4 flex-none rounded-full bg-primary-700/50 p-[3px]">
          <CheckIcon className="h-full w-full text-primary-400" />
        </div>
      )}
      <p
        className={cn('text-neutral-400', {
          'text-sm': size === 'sm',
        })}
      >
        {children}
      </p>
    </li>
  );
};
