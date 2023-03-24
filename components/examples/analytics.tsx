import BarChart from '@/components/charts/bar-chart';
import { sampleVisitsData } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const AnalyticsExample = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Prevent SSR/hydration errors.
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  return (
    <>
      <div>
        <h3 className="mb-4 font-bold text-neutral-300">Daily queries</h3>
        <BarChart
          data={sampleVisitsData}
          isLoading={false}
          interval="30d"
          height={180}
          countLabel="visits"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <h3 className="mb-4 font-bold text-neutral-300">Most asked</h3>
          <div className="flex flex-col gap-1 text-sm text-neutral-600">
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">223</p>
              <p>What is an RUV?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">185</p>
              <p>When do I need to submit by 83b?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">159</p>
              <p>What are preferred rights?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">152</p>
              <p>What is the difference between a SAFE and an RUV?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">152</p>
              <p>What is the difference between a SAFE and an RUV?</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-neutral-300">
            Most visited resources
          </h3>
          <div className="flex flex-col gap-1 text-sm text-neutral-600">
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">99</p>
              <p>Roll-ups</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">87</p>
              <p>Manage your Raise</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">152</p>
              <p>Cap Tables</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">151</p>
              <p>409A Valuations</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">133</p>
              <p>Data Rooms</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-neutral-300">Reported prompts</h3>
          <div className="flex flex-col gap-1 text-sm text-neutral-600">
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">9</p>
              <p>How do I send an update?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">8</p>
              <p>What is a SAFE?</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-8 flex-none text-left text-neutral-800">5</p>
              <p>Where can I see my cap table?</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
