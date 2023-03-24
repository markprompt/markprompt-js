import { FC, useState } from 'react';
import { Chat } from '@team-plain/react-chat-ui';
import { ChatBubbleIcon, Cross2Icon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import cn from 'classnames';
import colors from 'tailwindcss/colors';
import { useSession } from '@supabase/auth-helpers-react';

type ChatWindowProps = {};

export const plainTheme = {
  input: {
    borderColor: colors.neutral['200'],
    borderColorFocused: colors.neutral['500'],
    borderColorError: colors.rose['500'],
    borderColorDisabled: colors.neutral['100'],
    focusBoxShadow: '',
    textColorPlaceholder: colors.neutral['400'],
  },
  buttonPrimary: {
    background: colors.neutral['900'],
    backgroundHover: colors.neutral['800'],
    backgroundDisabled: colors.neutral['200'],
    textColor: colors.white,
    textColorDisabled: colors.neutral['400'],
    borderRadius: '6px',
  },
  composer: {
    iconButtonColor: colors.neutral['900'],
    iconButtonColorHover: colors.neutral['500'],
  },
  textColor: {
    base: colors.neutral['900'],
    muted: colors.neutral['500'],
    error: colors.rose['500'],
  },
};

export const ChatWindow: FC<ChatWindowProps> = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const session = useSession();

  return (
    <Popover.Root open={chatOpen} onOpenChange={setChatOpen}>
      <Popover.Trigger asChild>
        <div className="fixed right-8 bottom-8">
          <button
            className="transform rounded-full border border-neutral-800 bg-neutral-900 p-3 transition duration-300 hover:bg-neutral-1000"
            aria-label="Start chat"
          >
            <div className="relative">
              <Cross2Icon
                className={cn(
                  'absolute inset-0 h-5 w-5 transform text-neutral-300 duration-300',
                  {
                    'opacity-0': !chatOpen,
                  },
                )}
              />
              <ChatBubbleIcon
                className={cn(
                  'h-5 w-5 transform text-neutral-300 duration-300',
                  {
                    'opacity-0': chatOpen,
                  },
                )}
              />
            </div>
          </button>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="animate-chat-window z-20 mr-4 mb-4 w-[calc(100vw-32px)] sm:w-full"
          side="bottom"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="relative mt-4 h-[calc(100vh-240px)] max-h-[560px] w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl sm:w-[400px]">
            <Chat />
            <Popover.Close
              className="absolute top-3 right-3 z-20 rounded p-1 backdrop-blur transition hover:bg-neutral-100"
              aria-label="Close"
            >
              <Cross2Icon className="h-4 w-4 text-neutral-900" />
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
