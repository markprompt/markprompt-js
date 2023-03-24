import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon, CaretSortIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Slash } from '../ui/Slash';
import useTeams from '@/lib/hooks/use-teams';
import useProject from '@/lib/hooks/use-project';
import useTeam from '@/lib/hooks/use-team';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Button from '../ui/Button';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikValues,
} from 'formik';
import { NoAutoInput } from '../ui/Input';
import { ErrorLabel } from '../ui/Forms';
import { CTABar } from '../ui/SettingsCard';
import { Session, useSession } from '@supabase/auth-helpers-react';
import { createTeam } from '@/lib/api';
import { toast } from 'react-hot-toast';
import useUser from '@/lib/hooks/use-user';

const generateTeamName = (session: Session | null) => {
  if (session?.user) {
    const name =
      session.user.user_metadata.full_name ||
      session.user.user_metadata.name ||
      session.user.user_metadata.user_name;
    return `${name}'s Team`;
  } else {
    return 'New Team';
  }
};

type TeamProjectPickerProps = {
  onNewTeamClick: () => void;
};

const TeamPicker: FC<TeamProjectPickerProps> = ({ onNewTeamClick }) => {
  const { teams, loading } = useTeams();
  const { team } = useTeam();
  const [isOpen, setOpen] = useState(false);

  if (loading) {
    return <></>;
  }

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded p-1 outline-none transition dark:text-neutral-300 dark:hover:bg-neutral-900"
          aria-label="Select team"
        >
          <CaretSortIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-menu-up dropdown-menu-content"
          sideOffset={5}
        >
          {teams?.map((t) => {
            const checked = t.slug === team?.slug;
            return (
              <DropdownMenu.CheckboxItem
                key={`team-dropdown-${t.slug}`}
                className="dropdown-menu-item dropdown-menu-item-indent"
                checked={checked}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <>
                  {checked && (
                    <DropdownMenu.ItemIndicator className="dropdown-menu-item-indicator">
                      <CheckIcon className="h-4 w-4" />
                    </DropdownMenu.ItemIndicator>
                  )}
                  <Link href={`/${t.slug}`}>{t.name}</Link>
                </>
              </DropdownMenu.CheckboxItem>
            );
          })}
          <DropdownMenu.Separator className="dropdown-menu-separator" />
          <DropdownMenu.Item
            className="dropdown-menu-item dropdown-menu-item-indent"
            onClick={onNewTeamClick}
          >
            Create new team
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const TeamProjectPicker = () => {
  const router = useRouter();
  const session = useSession();
  const { user } = useUser();
  const { teams, mutate: mutateTeams, loading: loadingTeams } = useTeams();
  const { team } = useTeam();
  const { project, loading: loadingProject } = useProject();
  const [isNewProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  if (loadingTeams || !teams || !team) {
    return <></>;
  }

  const isNewProjectRoute =
    router.asPath === `/settings/${team.slug}/projects/new`;

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Slash size="md" />
        {team ? (
          <Link className="dropdown-menu-button" href={`/${team.slug}`}>
            {team?.name}
          </Link>
        ) : (
          <></>
        )}
        {user?.has_completed_onboarding && (
          <div className="-ml-2 -mr-2">
            <TeamPicker onNewTeamClick={() => setNewProjectDialogOpen(true)} />
          </div>
        )}
        {!loadingProject && team && project && (
          <>
            <Slash size="md" />
            <Link
              href={`/${team.slug}/${project.slug}`}
              className="dropdown-menu-button"
              aria-label="Select project"
            >
              {project.name}
            </Link>
          </>
        )}
        {isNewProjectRoute && (
          <>
            <Slash size="md" />
            <p className="text-sm text-neutral-300">New project</p>
          </>
        )}
      </div>
      <Dialog.Root
        open={isNewProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="animate-overlay-appear dialog-overlay" />
          <Dialog.Content className="animate-dialog-slide-in dialog-content max-h-min max-w-min">
            <Dialog.Title className="dialog-title">
              Create new team
            </Dialog.Title>
            <Dialog.Description className="dialog-description">
              Teams help you organize projects and manage members, billing and
              tokens.
            </Dialog.Description>
            <Formik
              initialValues={{ name: generateTeamName(session) }}
              validateOnMount
              validate={(values) => {
                let errors: FormikErrors<FormikValues> = {};
                if (!values.name) {
                  errors.name = 'Required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                if (!team) {
                  return;
                }
                setSubmitting(true);
                const newTeam = await createTeam(values.name);
                await mutateTeams([...(teams || []), newTeam]);
                setSubmitting(false);
                toast.success('Team created.');
                setNewProjectDialogOpen(false);
                setTimeout(() => {
                  router.replace({
                    pathname: '/[team]',
                    query: { team: newTeam.slug },
                  });
                }, 500);
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <div className="mt-2 mb-4 flex min-w-[400px] flex-col gap-1 p-4">
                    <p className="mb-1 text-xs font-medium text-neutral-300">
                      Name
                    </p>
                    <Field
                      type="text"
                      name="name"
                      as={NoAutoInput}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="name" component={ErrorLabel} />
                  </div>
                  <CTABar>
                    <Dialog.Close asChild>
                      <Button variant="plain" buttonSize="sm">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button
                      variant="cta"
                      disabled={!isValid}
                      loading={isSubmitting}
                      buttonSize="sm"
                    >
                      Create
                    </Button>
                  </CTABar>
                </Form>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default TeamProjectPicker;
