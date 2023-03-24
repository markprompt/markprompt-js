import { FC, useMemo } from 'react';
import useTeam from '@/lib/hooks/use-team';
import { NavSubtabsLayout, NavSubtabsLayoutProps } from './NavSubtabsLayout';

export const TeamSettingsLayout: FC<NavSubtabsLayoutProps> = (props) => {
  const { team } = useTeam();

  const subTabItems = useMemo(() => {
    if (!team?.slug) {
      return undefined;
    }
    const basePath = `/${team?.slug || ''}`;
    return [
      { label: 'Home', href: basePath },
      ...(!team?.is_personal
        ? [{ label: 'Team', href: `/settings${basePath}/team` }]
        : []),
      { label: 'Usage', href: `/settings${basePath}/usage` },
      { label: 'Plans', href: `/settings${basePath}/plans` },
      { label: 'Settings', href: `/settings${basePath}` },
    ];
  }, [team?.slug, team?.is_personal]);

  return <NavSubtabsLayout {...props} subTabItems={subTabItems} />;
};
