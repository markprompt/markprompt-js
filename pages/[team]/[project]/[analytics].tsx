import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import { Tag } from '@/components/ui/Tag';

// This is a hack. Currently, something weird is going on with pages
// named "analytics", probably ad-blockers blocking loading resources.
// This trick fixes it.
const Analytics = () => {
  return (
    <ProjectSettingsLayout
      title="Analytics"
      titleComponent={
        <div className="flex items-center">
          Analytics{' '}
          <Tag size="sm" color="fuchsia" className="mb-2 ml-2">
            Soon
          </Tag>
        </div>
      }
    >
      Analytics
    </ProjectSettingsLayout>
  );
};

export default Analytics;
