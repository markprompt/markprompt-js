import { FC, JSXElementConstructor, ReactNode } from 'react';
import { NavLayout } from './NavLayout';
import SubTabs, { SubTabItem } from './SubTabs';
import Head from 'next/head';
import cn from 'classnames';
import useUser from '@/lib/hooks/use-user';

export type NavSubtabsLayoutProps = {
  title: string;
  titleComponent?: ReactNode;
  noHeading?: boolean;
  width?: 'xs' | 'sm' | 'md' | 'lg';
  subTabItems?: SubTabItem[];
  SubHeading?: JSXElementConstructor<any>;
  RightHeading?: JSXElementConstructor<any>;
  children?: ReactNode;
};

export const NavSubtabsLayout: FC<NavSubtabsLayoutProps> = ({
  title,
  titleComponent,
  noHeading,
  width: w,
  subTabItems,
  SubHeading,
  RightHeading,
  children,
}) => {
  const { user, loading: loadingUser } = useUser();
  const width = !w ? 'lg' : w;

  return (
    <>
      <Head>
        <title>{`${title} | Markprompt`}</title>
      </Head>
      <NavLayout>
        {!!user?.has_completed_onboarding && !loadingUser && (
          <>
            <div className="fixed inset-x-0 z-10 bg-neutral-1100 pt-14">
              {subTabItems && <SubTabs items={subTabItems} />}
            </div>

            <div
              className={cn('relative mx-auto px-4 md:px-8', {
                'max-w-screen-lg': width === 'lg',
                'max-w-screen-md': width === 'md',
                'max-w-screen-sm': width === 'sm',
                'max-w-md': width === 'xs',
                'pt-32': noHeading,
                'pt-24': !noHeading,
              })}
            >
              {!noHeading && (
                <div className="mb-4 flex flex-col pt-8">
                  <div className="flex flex-col gap-4 sm:h-12 sm:flex-row sm:items-center">
                    <h1 className="truncate whitespace-nowrap text-2xl font-bold">
                      {titleComponent ?? title}
                    </h1>
                    {RightHeading && (
                      <>
                        <div className="flex-grow" />
                        <div className="flex-none">
                          <RightHeading />
                        </div>
                      </>
                    )}
                  </div>
                  {SubHeading && <SubHeading />}
                </div>
              )}
              {children}
            </div>
          </>
        )}
        {!loadingUser && !user?.has_completed_onboarding && (
          <div className="flex w-full flex-row justify-center p-40">
            <div className="animate-pulse px-3 py-1 text-sm text-neutral-500">
              Loading...
            </div>
          </div>
        )}
      </NavLayout>
    </>
  );
};
