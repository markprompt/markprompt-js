import { TeamSettingsLayout } from '@/components/layouts/TeamSettingsLayout';
import useProjects from '@/lib/hooks/use-projects';
import useTeam from '@/lib/hooks/use-team';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const Team = () => {
  const { team } = useTeam();
  const { projects } = useProjects();

  return (
    <TeamSettingsLayout
      title="Projects"
      RightHeading={() => (
        <>
          {team?.slug && (
            <Button
              asLink
              variant="cta"
              href={`/settings/${team.slug}/projects/new`}
            >
              New project
            </Button>
          )}
        </>
      )}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {team &&
          projects?.map((project) => (
            <Link
              key={`project-card-${project.slug}`}
              href={`/${team?.slug}/${project.slug}`}
            >
              <div className="rounded-lg border border-neutral-800 bg-neutral-1000 p-8 transition hover:bg-neutral-900">
                {project.name}
              </div>
            </Link>
          ))}
      </div>
    </TeamSettingsLayout>
  );
};

export default Team;
