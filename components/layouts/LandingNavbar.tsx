import Link from 'next/link';
import { useSession } from '@supabase/auth-helpers-react';
import { MotifIcon } from '../icons/Motif';
import { Slash } from '../ui/Slash';
import { GitHubIcon } from '../icons/GitHub';
import { DiscordIcon } from '../icons/Discord';

export default function LandingNavbar() {
  const session = useSession();

  return (
    <div className="animate-slide-down-delayed flex flex-row items-center gap-6 py-8">
      <div className="flex flex-none flex-row items-center gap-2 text-white">
        <a href="https://motif.land">
          <MotifIcon className="h-8 w-8 select-none text-neutral-100" />
        </a>{' '}
        <Slash className="mx-2" size="lg" />
        <Link
          href="/"
          className="text-lg font-semibold transition hover:opacity-80"
        >
          Markprompt
        </Link>
      </div>
      <div className="flex-grow" />
      <a
        className="hidden transform text-sm font-medium text-white opacity-60 hover:opacity-100 sm:block"
        href="#pricing"
      >
        Pricing
      </a>
      {session ? (
        <Link
          className="button-glow flex flex-row items-center gap-3 rounded-md px-4 py-2 text-sm font-semibold transition dark:bg-white dark:text-neutral-900 hover:dark:bg-neutral-300"
          href="/"
        >
          Go to app
        </Link>
      ) : (
        <>
          <Link
            className="hidden transform whitespace-nowrap text-sm font-medium text-white opacity-60 hover:opacity-100 sm:block"
            href="/signup"
          >
            Sign up
          </Link>
          <Link
            className="button-glow flex flex-row items-center gap-3 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition dark:bg-white dark:text-neutral-900 hover:dark:bg-neutral-300"
            href="/login"
          >
            Sign in
          </Link>
        </>
      )}
      <a
        className="hidden transform text-sm font-medium text-white opacity-60 hover:opacity-100 sm:block"
        href="https://github.com/motifland/markprompt"
      >
        <GitHubIcon className="h-5 w-5" />
      </a>
      <a
        className="hidden transform text-sm font-medium text-white opacity-60 hover:opacity-100 sm:block"
        href="https://discord.gg/MBMh4apz6X"
      >
        <DiscordIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
