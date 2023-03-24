import { useSession } from '@supabase/auth-helpers-react';
import { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import useUser from '@/lib/hooks/use-user';
import useTeams from '@/lib/hooks/use-teams';
import Link from 'next/link';

type ProfileMenuProps = {};

const ProfileMenu: FC<ProfileMenuProps> = () => {
  const session = useSession();
  const { user, signOut } = useUser();
  const { teams } = useTeams();

  const personalTeam = teams?.find((t) => t.is_personal);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="select-none outline-none transition hover:opacity-70"
          aria-label="Profile"
        >
          {session?.user?.user_metadata?.avatar_url ? (
            <Image
              alt="Profile"
              className="h-6 w-6 rounded-full"
              width={20}
              height={20}
              src={session?.user?.user_metadata?.avatar_url}
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-neutral-700" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-menu-up dropdown-menu-content mr-2 min-w-[160px]"
          sideOffset={5}
        >
          {user && (
            <DropdownMenu.Label className="dropdown-menu-item-noindent">
              <div className="flex flex-col pt-2 pb-3">
                <p className="text-sm text-neutral-300">{user.full_name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </DropdownMenu.Label>
          )}
          <DropdownMenu.Separator className="dropdown-menu-separator" />
          {personalTeam && (
            <DropdownMenu.Item asChild>
              <Link
                className="dropdown-menu-item dropdown-menu-item-noindent block"
                href={`/settings/${personalTeam.slug}`}
              >
                Settings
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator className="dropdown-menu-separator" />
          <DropdownMenu.Item asChild>
            <a
              className="dropdown-menu-item dropdown-menu-item-noindent block"
              href="https://twitter.com/markprompt"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              className="dropdown-menu-item dropdown-menu-item-noindent block"
              href="https://discord.gg/MBMh4apz6X"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              className="dropdown-menu-item dropdown-menu-item-noindent block"
              href="https://github.com/motifland/markprompt"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              className="dropdown-menu-item dropdown-menu-item-noindent block"
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="dropdown-menu-separator" />
          <DropdownMenu.Item
            onSelect={() => signOut()}
            className="dropdown-menu-item dropdown-menu-item-noindent"
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ProfileMenu;
