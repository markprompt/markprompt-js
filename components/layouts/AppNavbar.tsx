import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';
import { MarkpromptIcon } from '../icons/Markprompt';
import ProfileMenu from '../user/ProfileMenu';
import TeamProjectPicker from '../team/TeamProjectPicker';

type AppNavbarProps = {
  animated?: boolean;
};

export const AppNavbar: FC<AppNavbarProps> = ({ animated }) => {
  return (
    <div
      className={cn(
        animated && 'animate-slide-down-delayed',
        'fixed inset-x-0 z-20 flex h-14 flex-none flex-row items-center gap-4 border-b border-neutral-900 bg-neutral-1100 px-4 dark:border-neutral-900',
      )}
    >
      <div className="flex-none">
        <Link href="/">
          <MarkpromptIcon className="mx-auto h-8 w-8 text-white" />
        </Link>
      </div>
      <TeamProjectPicker />
      <div className="flex-grow" />
      <div className="flex flex-none items-center">
        <ProfileMenu />
      </div>
    </div>
  );
};
