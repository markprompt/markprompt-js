import { AnalyticsExample } from '@/components/examples/analytics';
import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import Onboarding from '@/components/onboarding/Onboarding';
import { Tag } from '@/components/ui/Tag';
import useUser from '@/lib/hooks/use-user';

const Project = () => {
  const { user, loading: loadingUser } = useUser();

  if (!loadingUser && !user?.has_completed_onboarding) {
    return <Onboarding />;
  }

  if (loadingUser) {
    return <></>;
  }

  return (
    <ProjectSettingsLayout
      title="Dashboard"
      titleComponent={
        <div className="flex items-center">
          Dashboard{' '}
          <Tag color="fuchsia" size="sm" className="mb-2 ml-2">
            Soon
          </Tag>
        </div>
      }
    >
      <div className="animate-slide-up-delayed">
        <AnalyticsExample />
      </div>
    </ProjectSettingsLayout>
  );
};

export default Project;
