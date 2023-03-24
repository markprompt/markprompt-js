import { FC, ReactNode } from 'react';
import { AppNavbar } from '@/components/layouts/AppNavbar';

type NavLayoutProps = {
  animated?: boolean;
  children?: ReactNode;
};

export const NavLayout: FC<NavLayoutProps> = ({ animated, children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <AppNavbar animated={animated} />
      <div className="pb-12">{children}</div>
    </div>
  );
};
