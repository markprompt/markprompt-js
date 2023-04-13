import BarChart from '@/components/charts/bar-chart';
import { TeamSettingsLayout } from '@/components/layouts/TeamSettingsLayout';
import { Tag } from '@/components/ui/Tag';
import { sampleVisitsData } from '@/lib/utils';

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
