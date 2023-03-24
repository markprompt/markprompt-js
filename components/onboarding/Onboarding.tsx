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

const Onboarding = () => {
  const { team } = useTeam();
  const { project } = useProject();
  const { user, mutate: mutateUser } = useUser();
  const [step, setStep] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);

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
            <div className="flex w-full justify-center">
              <Button
                className={cn({
                  'animate-slide-up': ctaVisible,
                  'opacity-0': !ctaVisible,
                })}
                variant="cta"
                onClick={async () => {
                  const data = { has_completed_onboarding: true };
                  await updateUser(data);
                  await mutateUser();
                  if (team && project) {
                    Router.push({
                      pathname: '/[team]/[project]/data',
                      query: { team: team.slug, project: project.slug },
                    });
                  }
                }}
              >
                Go to dashboard →
              </Button>
            </div>
          </div>
        </div>
      </NavLayout>
    </>
  );
};

export default Onboarding;
