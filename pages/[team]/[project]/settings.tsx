import Button from '@/components/ui/Button';
import { NoAutoInput } from '@/components/ui/Input';
import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import {
  CTABar,
  DescriptionLabel,
  SettingsCard,
} from '@/components/ui/SettingsCard';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikValues,
} from 'formik';
import { ErrorLabel } from '@/components/ui/Forms';
import useProject from '@/lib/hooks/use-project';
import {
  addDomain,
  addToken,
  deleteDomain,
  deleteProject,
  deleteToken,
  updateProject,
} from '@/lib/api';
import Router, { useRouter } from 'next/router';
import useTeam from '@/lib/hooks/use-team';
import { toast } from 'react-hot-toast';
import useProjects from '@/lib/hooks/use-projects';
import * as Dialog from '@radix-ui/react-dialog';
import ConfirmDialog from '@/components/dialogs/Confirm';
import { useCallback, useState } from 'react';
import { Domain, Project, Token } from '@/types/types';
import { isGitHubRepoAccessible } from '@/lib/github';
import useDomains from '@/lib/hooks/use-domains';
import { CopyIcon, Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import {
  copyToClipboard,
  isValidDomain,
  removeSchema,
  truncateMiddle,
} from '@/lib/utils';
import useTokens from '@/lib/hooks/use-tokens';
import { Tag } from '@/components/ui/Tag';

const ProjectSettingsPage = () => {
  const router = useRouter();
  const { team } = useTeam();
  const { projects, mutate: mutateProjects } = useProjects();
  const { project, mutate: mutateProject } = useProject();
  const { domains, mutate: mutateDomains } = useDomains();
  const { tokens, mutate: mutateTokens } = useTokens();
  const [loading, setLoading] = useState(false);
  const [domainToRemove, setDomainToRemove] = useState<Domain | undefined>(
    undefined,
  );
  const [tokenToRemove, setTokenToRemove] = useState<Token | undefined>(
    undefined,
  );
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  const _updateProject = useCallback(
    async (
      values: Partial<Project>,
      setSubmitting: (submitting: boolean) => void,
    ) => {
      if (!project || !projects || !team) {
        return;
      }
      const updatedProject = { ...project, ...values };
      await mutateProject(updateProject(project.id, values), {
        optimisticData: updatedProject,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
      await mutateProjects([
        ...projects.filter((p) => p.id !== updatedProject.id),
        updatedProject,
      ]);
      setSubmitting(false);
      toast.success('Project settings saved.');
      if (values.slug && router.query.project !== values.slug) {
        // Redirect if slug has changed
        setTimeout(() => {
          router.replace({
            pathname: '/[team]/[project]/settings',
            query: { team: team.slug, project: values.slug },
          });
        }, 500);
      }
    },
    [mutateProject, mutateProjects, project, projects, router, team],
  );

  if (!team || !projects || !project) {
    return <ProjectSettingsLayout title="Settings" width="sm" />;
  }

  const domainNames = domains?.map((d) => d.name) || [];

  return (
    <ProjectSettingsLayout title="Settings" width="sm">
      <div className="flex flex-col gap-8">
        <SettingsCard title="General">
          <Formik
            initialValues={{
              name: project.name,
              slug: project.slug,
            }}
            validateOnMount
            validate={(values) => {
              let errors: FormikErrors<FormikValues> = {};
              if (!values.name) {
                errors.name = 'Required';
              } else if (!values.slug) {
                errors.slug = 'Required';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              _updateProject(values, setSubmitting);
            }}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className="flex flex-col gap-1 p-4">
                  <p className="mb-1 text-xs font-medium text-neutral-300">
                    Name
                  </p>
                  <Field
                    type="text"
                    name="name"
                    inputSize="sm"
                    as={NoAutoInput}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="name" component={ErrorLabel} />
                  <p className="mb-1 mt-4 text-xs font-medium text-neutral-300">
                    Slug
                  </p>
                  <Field
                    type="text"
                    name="slug"
                    inputSize="sm"
                    as={NoAutoInput}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="slug" component={ErrorLabel} />
                </div>
                <CTABar>
                  <Button
                    disabled={!isValid}
                    loading={isSubmitting}
                    variant="plain"
                    buttonSize="sm"
                    type="submit"
                  >
                    Save
                  </Button>
                </CTABar>
              </Form>
            )}
          </Formik>
        </SettingsCard>
        <SettingsCard
          title="GitHub"
          description="Scan a public GitHub repository for Markdown files."
        >
          <Formik
            initialValues={{
              github_repo: project.github_repo,
            }}
            validateOnMount
            validate={async (values) => {
              let errors: FormikErrors<FormikValues> = {};
              if (values.github_repo) {
                const isAccessible = await isGitHubRepoAccessible(
                  values.github_repo,
                );
                if (!isAccessible) {
                  errors.github_repo = 'Repository is not accessible';
                }
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              _updateProject(values, setSubmitting);
            }}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className="flex flex-col gap-1 p-4">
                  <p className="mb-1 text-xs font-medium text-neutral-300">
                    Public repository URL
                  </p>
                  <Field
                    value={undefined}
                    type="text"
                    name="github_repo"
                    inputSize="sm"
                    as={NoAutoInput}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="github_repo" component={ErrorLabel} />
                </div>
                <CTABar>
                  <Button
                    disabled={!isValid}
                    loading={isSubmitting}
                    variant="plain"
                    buttonSize="sm"
                    type="submit"
                  >
                    Save
                  </Button>
                </CTABar>
              </Form>
            )}
          </Formik>
        </SettingsCard>
        <SettingsCard
          title="Whitelisted domains"
          description="Add your whitelisted domains here. Requests from these domains will be allowed to access your project's completions."
        >
          <div className="flex w-full flex-col divide-y divide-neutral-900 px-2 py-2">
            {domains?.map((domain) => {
              return (
                <div
                  className="group flex flex-row items-center gap-2 py-1"
                  key={`domain-${domain.name}`}
                >
                  <div
                    className="group flex w-full flex-row items-center gap-2 rounded-md px-2 py-1"
                    key={`domain-${domain.name}`}
                  >
                    <div className="flex-grow truncate text-sm text-neutral-300">
                      {domain.name}
                    </div>
                    <div
                      className="flex-none cursor-pointer rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800"
                      onClick={() => {
                        setDomainToRemove(domain);
                      }}
                    >
                      <Cross2Icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CTABar>
            <div className="w-full">
              <Formik
                initialValues={{
                  domain_name: '',
                }}
                validateOnMount
                validate={async (values) => {
                  let errors: FormikErrors<FormikValues> = {};
                  if (
                    values.domain_name &&
                    !isValidDomain(removeSchema(values.domain_name))
                  ) {
                    errors.domain_name = 'Invalid domain.';
                  } else if (
                    values.domain_name &&
                    domainNames.includes(values.domain_name)
                  ) {
                    errors.domain_name = 'Domain already added.';
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  try {
                    const newName = removeSchema(values.domain_name);
                    const newDomain = await addDomain(project.id, newName);
                    await mutateDomains([
                      ...(domains || []).filter((d) => d.name !== newName),
                      newDomain,
                    ]);
                    toast.success('Domain added.');
                    resetForm({ values: { domain_name: 'a' } });
                  } catch (e) {
                    toast.error('Error adding domain.');
                    console.error('Error adding domain', e);
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex w-full flex-row items-center gap-2">
                        <Field
                          value={undefined}
                          className="flex-grow"
                          type="text"
                          inputSize="sm"
                          name="domain_name"
                          as={NoAutoInput}
                          disabled={isSubmitting}
                        />
                        <Button
                          className="flex-none"
                          disabled={!isValid}
                          loading={isSubmitting}
                          variant="plain"
                          buttonSize="sm"
                          type="submit"
                        >
                          Add domain
                        </Button>
                      </div>
                      <ErrorMessage name="domain_name" component={ErrorLabel} />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </CTABar>
        </SettingsCard>
        <SettingsCard
          title="Public API key"
          description="This key can safely be used publicly to make requests to the completions endpoint from a whitelisted domain, for instance with the Markprompt React component."
        >
          <div className="group flex flex-row items-center gap-2 pt-1 pb-3">
            <div className="group flex w-full flex-row items-center gap-2 rounded-md px-4 py-1">
              <div className="truncate py-0.5 font-mono text-sm text-neutral-300">
                {project.public_api_key}
              </div>
              <div className="flex-grow" />
              <div
                className="flex-none cursor-pointer rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800"
                onClick={() => {
                  copyToClipboard(project.public_api_key);
                  toast.success('Project API key copied to clipboard.');
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </SettingsCard>
        <SettingsCard
          title={
            <>
              Tokens{' '}
              <Tag className="ml-1" size="sm" color="orange">
                Private
              </Tag>
            </>
          }
          description="Use authorization tokens to fetch completions from private endpoints. Do not expose these tokens publicly."
        >
          <div className="flex w-full flex-col divide-y divide-neutral-900 py-2">
            {!tokens ||
              (tokens.length === 0 && (
                <p className="px-2 text-sm text-neutral-500">
                  No tokens are currently associated to this project.
                </p>
              ))}
            {tokens?.map((token) => {
              return (
                <div
                  className="group flex w-full flex-row items-center gap-2 rounded-md px-4 py-1"
                  key={`domain-${token.value}`}
                >
                  <div className="truncate py-0.5 font-mono text-sm text-neutral-300">
                    {truncateMiddle(token.value, 2, 4, '***')}
                  </div>
                  <div className="flex-grow" />
                  <div
                    className="flex-none cursor-pointer rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800"
                    onClick={() => {
                      copyToClipboard(token.value);
                      toast.success('Copied to clipboard.');
                    }}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </div>
                  <div
                    className="flex-none cursor-pointer rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800"
                    onClick={() => {
                      setTokenToRemove(token);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
          <CTABar>
            <Button
              className="flex-none"
              loading={isGeneratingToken}
              variant="plain"
              buttonSize="sm"
              type="submit"
              onClick={async () => {
                setIsGeneratingToken(true);
                const newToken = await addToken(project.id);
                await mutateTokens([...(tokens || []), newToken]);
                setIsGeneratingToken(false);
                toast.success('New token generated.');
              }}
            >
              Generate new token
            </Button>
          </CTABar>
          <Dialog.Root
            open={!!domainToRemove}
            onOpenChange={() => setDomainToRemove(undefined)}
          >
            <ConfirmDialog
              title={`Remove domain ${domainToRemove?.name}?`}
              description="Requests from this domain will no longer be able to access your project completions."
              cta="Remove"
              variant="danger"
              loading={loading}
              onCTAClick={async () => {
                if (!domainToRemove) {
                  return;
                }
                setLoading(true);
                await deleteDomain(project.id, domainToRemove.id);
                setDomainToRemove(undefined);
                setLoading(false);
                await mutateDomains([
                  ...(domains || []).filter((d) => d.id !== domainToRemove.id),
                ]);
                toast.success('Domain removed.');
              }}
            />
          </Dialog.Root>
        </SettingsCard>
        <SettingsCard title="Delete project">
          <DescriptionLabel>
            The project will be permanently deleted, including all associated
            training data.
          </DescriptionLabel>
          <CTABar>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="danger" buttonSize="sm">
                  Delete
                </Button>
              </Dialog.Trigger>
              <ConfirmDialog
                title={`Delete ${project.name}?`}
                description="All associated data will be deleted, and the prompt will no longer provide answers."
                cta="Delete"
                variant="danger"
                loading={loading}
                onCTAClick={async () => {
                  if (!project) {
                    return;
                  }
                  setLoading(true);
                  const name = project.name;
                  await deleteProject(project.id);
                  await mutateProjects(
                    projects.filter((p) => p.id !== project.id),
                  );
                  await mutateProject();
                  toast.success(`Project ${name} has been deleted.`);
                  setLoading(false);
                  Router.replace('/');
                }}
              />
            </Dialog.Root>
          </CTABar>
        </SettingsCard>
      </div>
      <Dialog.Root
        open={!!domainToRemove}
        onOpenChange={() => setDomainToRemove(undefined)}
      >
        <ConfirmDialog
          title={`Remove domain ${domainToRemove?.name}?`}
          description="Requests from this domain will no longer be able to access your project completions."
          cta="Remove"
          variant="danger"
          loading={loading}
          onCTAClick={async () => {
            if (!domainToRemove) {
              return;
            }
            setLoading(true);
            await deleteDomain(project.id, domainToRemove.id);
            setLoading(false);
            await mutateDomains([
              ...(domains || []).filter((d) => d.id !== domainToRemove.id),
            ]);
            setDomainToRemove(undefined);
            toast.success('Domain removed.');
          }}
        />
      </Dialog.Root>
      <Dialog.Root
        open={!!tokenToRemove}
        onOpenChange={() => setTokenToRemove(undefined)}
      >
        <ConfirmDialog
          title={`Delete token?`}
          description="Requests using this token will no longer return results."
          cta="Delete"
          variant="danger"
          loading={loading}
          onCTAClick={async () => {
            if (!tokenToRemove) {
              return;
            }
            setLoading(true);
            await deleteToken(project.id, tokenToRemove.id);
            setLoading(false);
            await mutateTokens([
              ...(tokens || []).filter((d) => d.id !== tokenToRemove.id),
            ]);
            setTokenToRemove(undefined);
            toast.success('Token deleted.');
          }}
        />
      </Dialog.Root>
    </ProjectSettingsLayout>
  );
};

export default ProjectSettingsPage;
