import classNames from 'classnames';
import { FC, ReactNode } from 'react';

type TagProps = {
  className?: string;
  color?: 'fuchsia' | 'orange' | 'sky';
  size?: 'sm' | 'base';
  children: ReactNode;
};

export const Tag: FC<TagProps> = ({
  className,
  color = 'fuchsia',
  size = 'sm',
  children,
}) => {
  return (
    <span
      className={classNames(
        className,
        'w-min transform items-center gap-2 whitespace-nowrap rounded-full font-medium transition',
        {
          'bg-primary-900/20 text-primary-400': color === 'fuchsia',
          'bg-orange-900/20 text-orange-400': color === 'orange',
          'bg-sky-900/20 text-sky-400': color === 'sky',
          'px-2 py-0.5 text-xs': size === 'sm',
        },
      )}
    >
      {children}
    </span>
  );
};
