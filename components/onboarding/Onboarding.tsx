import Head from 'next/head';
import { NavLayout } from '@/components/layouts/NavLayout';
import { useCallback, useState } from 'react';
import cn from 'classnames';
import AddFiles from './AddFiles';
import Query from './Query';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import useUser from '@/lib/hooks/use-user';
import { updateUser } from '@/lib/api';
import { showConfetti } from '@/lib/utils';
import Router from 'next/router';
import useTeam from '@/lib/hooks/use-team';
import useProject from '@/lib/hooks/use-project';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

const Onboarding = () => {
  const { team } = useTeam();
  const { project } = useProject();
  const { user, mutate: mutateUser } = useUser();
  const [step, setStep] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);

  const finishOnboarding = useCallback(async () => {
    const data = { has_completed_onboarding: true };
    await updateUser(data);
    await mutateUser();
    if (team && project) {
      Router.push({
        pathname: '/[team]/[project]/data',
        query: { team: team.slug, project: project.slug },
      });
    }
  }, [mutateUser, project, team]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Get started | Markprompt</title>
      </Head>
      <NavLayout animated={false}>
        <div className="animate-slide-up relative z-0 mx-auto w-full max-w-screen-sm">
          <div
            className={cn('absolute w-full transform transition duration-500', {
              'pointer-events-none -translate-x-24 opacity-0': step !== 0,
            })}
          >
            <AddFiles
              onTrainingComplete={() => {
                toast.success('Processing complete');
                setTimeout(() => {
                  setStep(1);
                }, 1000);
              }}
              onNext={() => {
                setStep(1);
              }}
            />
          </div>
          <div
            className={cn(
              'absolute inset-x-0 transform transition duration-500',
              {
                'pointer-events-none translate-x-24 opacity-0': step !== 1,
              },
            )}
          >
            <Query
              goBack={() => {
                setStep(0);
              }}
              didCompleteFirstQuery={async () => {
                setTimeout(() => {
                  showConfetti();
                }, 1000);
                setTimeout(() => {
                  setCtaVisible(true);
                }, 2000);
              }}
              isReady={step === 1}
            />
            <p
              onClick={() => {
                finishOnboarding();
              }}
              className="text-center text-sm text-neutral-600"
            >
              <span className="cursor-pointer border-b border-dashed dark:border-neutral-800">
                Skip onboarding
              </span>{' '}
              →
            </p>
            <div
              className={cn(
                'flex w-full flex-col items-center justify-center gap-4',
                {
                  'animate-slide-up': ctaVisible,
                  'opacity-0': !ctaVisible,
                },
              )}
            >
              <Button
                variant="cta"
                onClick={() => {
                  finishOnboarding();
                }}
              >
                Go to dashboard →
              </Button>
              <div
                className={cn('mt-1 flex items-center gap-4', {
                  'animate-slide-up': ctaVisible,
                  'opacity-0': !ctaVisible,
                })}
              >
                <Checkbox.Root
                  className="flex h-5 w-5 items-center justify-center rounded border border-neutral-700 bg-neutral-1000 transition hover:bg-neutral-900"
                  id="subscribe"
                  onCheckedChange={async (checked: boolean) => {
                    await updateUser({ subscribe_to_product_updates: checked });
                    await mutateUser();
                  }}
                >
                  <Checkbox.Indicator className="text-green-600">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  className="cursor-pointer select-none text-sm text-neutral-500"
                  htmlFor="subscribe"
                >
                  Keep me posted about major product updates
                </label>
              </div>
            </div>
          </div>
        </div>
      </NavLayout>
    </>
  );
};

export default Onboarding;
