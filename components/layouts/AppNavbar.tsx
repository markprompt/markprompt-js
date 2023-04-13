import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

import { MarkpromptIcon } from '../icons/Markprompt';
import TeamProjectPicker from '../team/TeamProjectPicker';
import ProfileMenu from '../user/ProfileMenu';

type AppNavbarProps = {
  animated?: boolean;
};

export const AppNavbar: FC<AppNavbarProps> = ({ animated }) => {
  return (
    <div
      className={cn(
        animated && 'animate-slide-down-delayed',
        'fixed inset-x-0 top-0 z-20 flex h-14 flex-none flex-row items-center gap-4 border-b border-neutral-900 bg-neutral-1100 px-4 dark:border-neutral-900',
      )}
    >
      <div className="flex-none">
        <Link href="/">
          <MarkpromptIcon className="mx-auto h-8 w-8 text-white" />
        </Link>
      </div>
      <TeamProjectPicker />
      <div className="flex-grow" />
      <div className="flex flex-none items-center gap-4">
        <NavigationMenu.Root>
          <NavigationMenu.List className="flex flex-row items-center gap-2 px-2 py-1">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                className={cn(
                  'block h-full rounded-md px-2 py-1.5 text-sm text-neutral-300 outline-none ring-white ring-offset-0 transition duration-200 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:text-neutral-100 focus-visible:ring-1',
                )}
              >
                <a target="_blank" rel="noreferrer" href="/docs">
                  Docs
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
        <ProfileMenu />
      </div>
    </div>
  );
};
