import { FC, ReactNode } from 'react';
import { AppNavbar } from '@/components/layouts/AppNavbar';

type NavLayoutProps = {
  animated?: boolean;
  children?: ReactNode;
};

export const NavLayout: FC<NavLayoutProps> = ({ animated, children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 w-full items-center justify-center overflow-x-auto truncate whitespace-nowrap bg-orange-900/30 px-4 text-center text-xs text-orange-600">
        Heads up! Due to unexpected high demand, we are hitting some rate
        limits, and are currently limiting training to 20 files. You may
        experience empty prompt results occasionally. We are addressing this.
      </div>
      <AppNavbar animated={animated} />
      <div className="pb-12">{children}</div>
    </div>
  );
};
