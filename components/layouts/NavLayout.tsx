import { FC, ReactNode } from 'react';
import { AppNavbar } from '@/components/layouts/AppNavbar';

type NavLayoutProps = {
  animated?: boolean;
  children?: ReactNode;
};

export const NavLayout: FC<NavLayoutProps> = ({ animated, children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 w-full items-center justify-center overflow-x-auto truncate whitespace-nowrap bg-fuchsia-900/30 px-4 text-center text-xs text-fuchsia-500">
        Heads up! Due to unexpected high demand, we are hitting some rate
        limits. You may experience this when syncing a GitHub repo. We are
        addressing this.
      </div>
      <AppNavbar animated={animated} />
      <div className="pb-12">{children}</div>
    </div>
  );
};
