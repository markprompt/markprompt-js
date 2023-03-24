import { Auth } from '@supabase/auth-ui-react';
import { ThemeMinimal } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { MarkpromptIcon } from '@/components/icons/Markprompt';
import Button from '@/components/ui/Button';
import { FC } from 'react';
import Link from 'next/link';
import { getOrigin } from '@/lib/utils';
import useUser from '@/lib/hooks/use-user';

type AuthPageProps = {
  type: 'signin' | 'signup';
};

const AuthPage: FC<AuthPageProps> = ({ type }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { signOut } = useUser();

  return (
    <>
      <div>
        <div className="mx-auto w-min">
          <Link href="/">
            <MarkpromptIcon className="mx-auto mt-16 h-16 w-16 text-white outline-none" />
          </Link>
        </div>
        {!session ? (
          <div className="mx-auto mt-16 max-w-sm">
            <Auth
              view={type === 'signup' ? 'sign_up' : 'sign_in'}
              redirectTo={getOrigin() + '/'}
              socialLayout="vertical"
              providers={['github', 'google']}
              supabaseClient={supabase}
              appearance={{ theme: ThemeMinimal }}
              theme="default"
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Password',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Password',
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2 p-8 pt-20 text-neutral-300">
            <p className="mb-4">You are already signed in.</p>
            <Button asLink className="w-full" variant="plain" href="/">
              Go to app
            </Button>
            <Button className="w-full" variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthPage;
