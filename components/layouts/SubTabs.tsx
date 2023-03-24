import { FC } from 'react';
import cn from 'classnames';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { useRouter } from 'next/router';

export type SubTabItem = { label: string; href: string };

type SubTabsProps = {
  items: SubTabItem[];
};

const SubTabs: FC<SubTabsProps> = ({ items }) => {
  const { asPath } = useRouter();

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex flex-row items-center gap-2 border-b border-neutral-900 px-2 py-1">
        {items.map((item, i) => (
          <NavigationMenu.Item key={`tab-item-${i}`}>
            <NavigationMenu.Link
              asChild
              className={cn(
                'block h-full rounded-md px-2 py-1.5 text-sm font-medium outline-none ring-white ring-offset-0 transition duration-200 focus-visible:ring-1',
                {
                  'text-neutral-100': asPath === item.href,
                  'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:text-neutral-100':
                    asPath !== item.href,
                },
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default SubTabs;
