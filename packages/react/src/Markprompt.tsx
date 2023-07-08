import type { FileSectionReference, Source } from '@markprompt/core';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { animated, useSpring } from '@react-spring/web';
import Emittery from 'emittery';
import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { Feedback } from './Feedback.js';
import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SearchIcon,
  SparklesIcon,
} from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import { SearchResult } from './SearchResult.js';
import { type MarkpromptOptions, type SectionHeading } from './types.js';
import { useToggle } from './useToggle.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'children'
    | 'isSearchActive'
    | 'open'
    | 'onOpenChange'
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
    display = 'dialog',
    projectKey,
    prompt,
    trigger,
    search,
    showBranding,
    title,
    description,
    close,
    debug,
    ...dialogProps
  } = props;

  const [open, setOpen] = useState(false);

  const [showSearch, toggleSearch] = useToggle(search?.enabled ?? false);

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
      isSearchActive={showSearch}
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
              {...props}
              showSearch={showSearch}
              toggleSearch={toggleSearch}
              includeClose={close?.visible !== false}
            />
          </BaseMarkprompt.Content>
        </BaseMarkprompt.Portal>
      )}
      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
        >
          <MarkpromptContent
            {...props}
            showSearch={showSearch}
            toggleSearch={toggleSearch}
            includeClose={false}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

type MarkpromptContentProps = Pick<
  MarkpromptProps,
  'close' | 'feedback' | 'prompt' | 'references' | 'search'
> & {
  showSearch?: boolean;
  toggleSearch?: () => void;
  includeClose?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const {
    close,
    feedback,
    includeClose = true,
    prompt,
    references,
    search,
    showSearch = false,
    toggleSearch = noop,
  } = props;

  return (
    <>
      <BaseMarkprompt.Form className="MarkpromptForm">
        <BaseMarkprompt.Prompt
          className="MarkpromptPrompt"
          placeholder={
            prompt?.placeholder ??
            (search?.enabled
              ? 'Search or ask a question…'
              : DEFAULT_MARKPROMPT_OPTIONS.prompt!.label)
          }
          labelClassName="MarkpromptPromptLabel"
          label={
            <AccessibleIcon.Root
              label={prompt?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!}
            >
              <SearchIcon className="MarkpromptSearchIcon" />
            </AccessibleIcon.Root>
          }
        />

        {includeClose && (
          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root
              label={close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!}
            >
              <kbd>Esc</kbd>
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        )}
      </BaseMarkprompt.Form>

      <AnswerOrSearchResults
        feedback={feedback}
        search={search}
        references={references}
        showSearch={showSearch}
        promptCTA={prompt?.cta}
        toggleSearchAnswer={toggleSearch}
      />
    </>
  );
}

type AnswerOrSearchResultsProps = {
  feedback?: MarkpromptOptions['feedback'];
  promptCTA?: string;
  references: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
  showSearch: boolean;
  toggleSearchAnswer: () => void;
};

function AnswerOrSearchResults(
  props: AnswerOrSearchResultsProps,
): ReactElement {
  const {
    feedback,
    promptCTA,
    references,
    search,
    showSearch,
    toggleSearchAnswer,
  } = props;

  if (!search?.enabled) {
    return (
      <AnswerContainer
        feedback={feedback}
        isSearchEnabled={search?.enabled}
        references={references}
        toggleSearchAnswer={toggleSearchAnswer}
      />
    );
  }

  return (
    <div style={{ position: 'relative', overflowY: 'auto' }}>
      <Transition isVisible={showSearch}>
        <SearchResultsContainer
          getHref={search?.getHref}
          showSearch={showSearch}
          promptCTA={promptCTA}
          toggleSearchAnswer={toggleSearchAnswer}
        />
      </Transition>
      <Transition isVisible={!showSearch} isFlipped>
        <AnswerContainer
          feedback={feedback}
          isSearchEnabled={search?.enabled}
          references={references}
          toggleSearchAnswer={toggleSearchAnswer}
        />
      </Transition>
    </div>
  );
}

type TransitionProps = {
  isVisible: boolean;
  isFlipped?: boolean;
  children: ReactNode;
};

const Transition = (props: TransitionProps): ReactElement => {
  const { isVisible, isFlipped, children } = props;

  const [display, setDisplay] = useState(isVisible ? 'block' : 'none');

  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    x: isVisible ? '0%' : isFlipped ? '100%' : '-100%',
    config: {
      tension: 800,
      friction: 60,
    },
    onStart: () => {
      if (!isVisible) return;
      setDisplay('block');
    },
    onRest: () => {
      if (isVisible) return;
      setDisplay('none');
    },
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        inset: 0,
        display,
        ...styles,
      }}
    >
      {children}
    </animated.div>
  );
};

interface SearchBoxTriggerProps {
  trigger: MarkpromptOptions['trigger'];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SearchBoxTrigger(props: SearchBoxTriggerProps): ReactElement {
  const { trigger, setOpen, open } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (open) return;
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <BaseMarkprompt.DialogTrigger className="MarkpromptSearchBoxTrigger">
      <AccessibleIcon.Root
        label={trigger?.label ?? DEFAULT_MARKPROMPT_OPTIONS.trigger!.label!}
      >
        <span className="MarkpromptSearchBoxTriggerContent">
          <span className="MarkpromptSearchBoxTriggerText">
            <SearchIcon width={16} height={16} />{' '}
            {trigger?.placeholder || 'Search'}{' '}
          </span>
          <kbd>
            {navigator.platform.indexOf('Mac') === 0 ||
            navigator.platform === 'iPhone' ? (
              <CommandIcon className="MarkpromptKeyboardKey" />
            ) : (
              <ChevronUpIcon className="MarkpromptKeyboardKey" />
            )}
            <CornerDownLeftIcon className="MarkpromptKeyboardKey" />
          </kbd>
        </span>
      </AccessibleIcon.Root>
    </BaseMarkprompt.DialogTrigger>
  );
}

type SearchResultsContainerProps = {
  getHref?: (reference: FileSectionReference) => string;
  showSearch: boolean;
  promptCTA?: string;
  toggleSearchAnswer: () => void;
};

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const { showSearch, promptCTA, toggleSearchAnswer, getHref } = props;

  const btn = useRef<HTMLButtonElement>(null);

  const {
    abort,
    submitPrompt,
    state,
    searchResults,
    prompt,
    activeSearchResult,
    updateActiveSearchResult,
  } = useMarkpromptContext();

  const hasActiveSearchResult = activeSearchResult !== undefined;

  useEffect(() => {
    if (hasActiveSearchResult) {
      btn.current?.blur();
    }
  }, [hasActiveSearchResult]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        if (showSearch) submitPrompt();
        toggleSearchAnswer();
      }

      if (event.key === 'ArrowUp') {
        if (activeSearchResult === 'markprompt-result-0') {
          btn.current?.focus();
          updateActiveSearchResult(undefined);
        }
      }

      if (event.key === 'ArrowDown') {
        if (searchResults.length > 0 && activeSearchResult === undefined) {
          updateActiveSearchResult('markprompt-result-0');
          const el = document.querySelector('#markprompt-prompt');
          if (el instanceof HTMLInputElement) el.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeSearchResult,
    searchResults,
    showSearch,
    submitPrompt,
    toggleSearchAnswer,
    updateActiveSearchResult,
  ]);

  return (
    <div className="MarkpromptSearchResultsContainer">
      <button
        ref={btn}
        className="MarkpromptSearchAnswerButton"
        onClick={() => {
          abort();
          toggleSearchAnswer();
          submitPrompt();
        }}
        onMouseOver={() => {
          btn.current?.focus();
          updateActiveSearchResult(undefined);
        }}
      >
        <span aria-hidden className="MarkpromptSearchResultIconWrapper">
          <SparklesIcon focusable={false} className="MarkpromptSearchIcon" />
        </span>
        <span>{promptCTA || DEFAULT_MARKPROMPT_OPTIONS.prompt!.cta!}</span>
        <kbd>
          {navigator.platform.indexOf('Mac') === 0 ||
          navigator.platform === 'iPhone' ? (
            <CommandIcon className="MarkpromptKeyboardKey" />
          ) : (
            <ChevronUpIcon className="MarkpromptKeyboardKey" />
          )}
          <CornerDownLeftIcon className="MarkpromptKeyboardKey" />
        </kbd>
      </button>
      {state === 'done' && searchResults.length === 0 && (
        <div className="MarkpromptNoSearchResults">
          <p>
            No results for “<span>{prompt}</span>”
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <BaseMarkprompt.SearchResults
          className="MarkpromptSearchResults"
          SearchResultComponent={(props) => (
            <SearchResult {...props} getHref={getHref} />
          )}
        />
      )}
    </div>
  );
}

type AnswerContainerProps = {
  feedback?: MarkpromptOptions['feedback'];
  isSearchEnabled?: boolean;
  references: MarkpromptOptions['references'];
  toggleSearchAnswer: () => void;
};

function AnswerContainer({
  isSearchEnabled,
  references,
  feedback,
  toggleSearchAnswer,
}: AnswerContainerProps): ReactElement {
  const { abort, state } = useMarkpromptContext();

  return (
    <div className="MarkpromptPromptContainer">
      {isSearchEnabled && (
        <button
          className="MarkpromptBackButton"
          onClick={() => {
            abort();
            toggleSearchAnswer();
          }}
        >
          <span aria-hidden>
            <ChevronLeftIcon className="MarkpromptHighlightedIcon" />
          </span>
          <span>Back to search</span>
        </button>
      )}

      <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
        <Answer />
        {feedback?.enabled && state === 'done' && (
          <Feedback className="MarkpromptPromptFeedback" />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        heading={references?.heading || references?.referencesText}
        getHref={references?.getHref}
        getLabel={references?.getLabel}
        // Backwards compatibility
        transformReferenceId={references?.transformReferenceId}
      />
    </div>
  );
}

export { Markprompt, openMarkprompt, type MarkpromptProps };
