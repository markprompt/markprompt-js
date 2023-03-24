import cn from 'classnames';
import { FC } from 'react';

type SlashProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Slash: FC<SlashProps> = ({ size, className }) => {
  return (
    <div
      className={cn(
        className,
        'w-[0.5px] rotate-[20deg] transform bg-neutral-700',
        {
          'h-[30px]': size === 'lg',
          'h-[24px]': size === 'md',
          'h-[18px]': size === 'sm',
        },
      )}
    />
  );
};
