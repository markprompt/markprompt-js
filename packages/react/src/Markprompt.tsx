import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import Emittery from 'emittery';
import React, {
  useEffect,
  useState,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { ChatIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { PromptView } from './PromptView.js';
import { SearchBoxTrigger } from './SearchBoxTrigger.js';
import { SearchView } from './SearchView.js';
import { Transition } from './Transition.js';
import { type MarkpromptOptions } from './types.js';
import type { Views } from './useMarkprompt.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'activeView'
    | 'children'
    | 'onOpenChange'
    | 'open'
    | 'promptOptions'
    | 'searchOptions'
  > & {
    projectKey: string;
  };

const emitter = new Emittery<{ open: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger or opening the
 * Markprompt dialog in response to other user actions.
 */
function openMarkprompt(): void {
  emitter.emit('open');
}

function Markprompt(props: MarkpromptProps): ReactElement {
  const {
    close,
    debug,
    description,
    display = 'dialog',
    projectKey,
    prompt,
    references,
    search,
    showBranding,
    title,
    trigger,
    ...dialogProps
  } = props;

  const [open, setOpen] = useState(false);

  const [activeView, setActiveView] = useState<Views>(
    search?.enabled ? 'search' : 'prompt',
  );

  useEffect(() => {
    if (!trigger?.customElement || display !== 'dialog') {
      return;
    }
    const onOpen = (): void => setOpen(true);
    emitter.on('open', onOpen);
    return () => emitter.off('open', onOpen);
  }, [trigger?.customElement, display]);

  return (
    <BaseMarkprompt.Root
      projectKey={projectKey}
      display={display}
      activeView={activeView}
      promptOptions={prompt}
      searchOptions={search}
      open={open}
      onOpenChange={setOpen}
      debug={debug}
      {...dialogProps}
    >
      {!trigger?.customElement && display === 'dialog' && (
        <>
          {trigger?.floating !== false ? (
            <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
              <AccessibleIcon.Root
                label={
                  trigger?.label ?? DEFAULT_MARKPROMPT_OPTIONS.trigger!.label!
                }
              >
                <ChatIcon
                  className="MarkpromptChatIcon"
                  width="24"
                  height="24"
                />
              </AccessibleIcon.Root>
            </BaseMarkprompt.DialogTrigger>
          ) : (
            <SearchBoxTrigger trigger={trigger} setOpen={setOpen} open={open} />
          )}
        </>
      )}

      {display === 'dialog' && (
        <>
          <BaseMarkprompt.Portal>
            <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
            <BaseMarkprompt.Content
              className="MarkpromptContentDialog"
              showBranding={showBranding}
            >
              <BaseMarkprompt.Title hide={title?.hide ?? true}>
                {title?.text ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label}
              </BaseMarkprompt.Title>

              {description?.text && (
                <BaseMarkprompt.Description hide={description?.hide ?? true}>
                  {description?.text}
                </BaseMarkprompt.Description>
              )}

              <MarkpromptContent
                activeView={activeView}
                prompt={prompt}
                references={references}
                search={search}
                setActiveView={setActiveView}
              />

              {close?.visible !== false && (
                <BaseMarkprompt.Close className="MarkpromptClose">
                  <AccessibleIcon.Root
                    label={
                      close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!
                    }
                  >
                    <kbd>Esc</kbd>
                  </AccessibleIcon.Root>
                </BaseMarkprompt.Close>
              )}
            </BaseMarkprompt.Content>
          </BaseMarkprompt.Portal>
        </>
      )}

      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
        >
          <MarkpromptContent
            prompt={prompt}
            search={search}
            references={references}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

type MarkpromptContentProps = {
  activeView: Views;
  prompt: MarkpromptOptions['prompt'];
  references: MarkpromptOptions['references'];
  search: MarkpromptOptions['search'];
  setActiveView: Dispatch<SetStateAction<Views>>;
};

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const { activeView, prompt, references, search, setActiveView } = props;

  return (
    <div className="MarkpromptViews">
      <Transition isVisible={activeView === 'search'}>
        <SearchView
          handleViewChange={() => setActiveView('prompt')}
          prompt={prompt}
          search={search}
        />
      </Transition>
      <Transition isVisible={activeView === 'prompt'} isFlipped>
        <PromptView
          handleViewChange={() => setActiveView('search')}
          prompt={prompt}
          search={search}
          references={references}
        />
      </Transition>
    </div>
  );
}

export { Markprompt, openMarkprompt, type MarkpromptProps };
