import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import { Playground } from '@/components/files/Playground';

const PlaygroundPage = () => {
  return (
    <ProjectSettingsLayout title="Playground" noHeading>
      <div className="panel-glow-color mx-auto h-[calc(100vh-240px)] max-w-screen-md rounded-lg border border-neutral-900 bg-neutral-1000 px-8 py-6">
        <Playground />
      </div>
    </ProjectSettingsLayout>
  );
};

export default PlaygroundPage;
