import { TeamSettingsLayout } from '@/components/layouts/TeamSettingsLayout';
import BarChart from '@/components/charts/bar-chart';
import { sampleVisitsData } from '@/lib/utils';
import { Tag } from '@/components/ui/Tag';

const Usage = () => {
  return (
    <TeamSettingsLayout
      title="Usage"
      titleComponent={
        <div className="flex items-center">
          Usage{' '}
          <Tag color="fuchsia" size="sm" className="mb-2 ml-2">
            Soon
          </Tag>
        </div>
      }
    >
      <BarChart
        data={sampleVisitsData}
        isLoading={false}
        interval="30d"
        height={180}
        countLabel="visits"
      />
    </TeamSettingsLayout>
  );
};

export default Usage;
