import type { Source } from '@markprompt/core';
import * as BaseMarkprompt from '@markprompt/react';
import { useMarkpromptContext } from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { animated, useSpring } from '@react-spring/web';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { Answer } from './Answer.js';
import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SearchIcon,
  SparklesIcon,
} from './icons.js';
import { References } from './References.js';
import { SearchResult } from './SearchResult.js';
import { type MarkpromptOptions } from './types.js';

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

function useToggle(initial: boolean): [on: boolean, toggle: () => void] {
  const [on, set] = useState(initial);
  return useMemo(() => [on, () => set((prev) => !prev)], [on]);
}

function Markprompt(props: MarkpromptProps): ReactElement {
  const {
    close,
    description,
    projectKey,
    prompt,
    references,
    title,
    trigger,
    search,
    showBranding = true,
    ...dialogProps
  } = props;

  const [open, setOpen] = useState(false);

  const [showSearch, toggle] = useToggle(search?.enabled ?? false);

  return (
    <BaseMarkprompt.Root
      projectKey={projectKey}
      isSearchActive={showSearch}
      promptOptions={prompt}
      searchOptions={search}
      open={open}
      onOpenChange={setOpen}
      {...dialogProps}
    >
      {trigger?.floating !== false ? (
        <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
          <AccessibleIcon.Root label={trigger?.label ?? 'Open Markprompt'}>
            <ChatIcon className="MarkpromptChatIcon" width="24" height="24" />
          </AccessibleIcon.Root>
        </BaseMarkprompt.DialogTrigger>
      ) : (
        <SearchBoxTrigger trigger={trigger} setOpen={setOpen} open={open} />
      )}

      <BaseMarkprompt.Portal>
        <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
        <BaseMarkprompt.Content
          className="MarkpromptContent"
          showBranding={showBranding}
        >
          <BaseMarkprompt.Title hide={title?.hide ?? true}>
            {title?.text ?? 'Ask me anything'}
          </BaseMarkprompt.Title>

          {description?.text && (
            <BaseMarkprompt.Description hide={description?.hide ?? true}>
              {description?.text}
            </BaseMarkprompt.Description>
          )}

          <BaseMarkprompt.Form className="MarkpromptForm">
            <BaseMarkprompt.Prompt
              className="MarkpromptPrompt"
              placeholder={
                prompt?.placeholder ??
                (search?.enabled
                  ? 'Search or ask a question…'
                  : 'Ask me anything…')
              }
              labelClassName="MarkpromptPromptLabel"
              label={
                <AccessibleIcon.Root
                  label={prompt?.label ?? 'Ask me anything…'}
                >
                  <SearchIcon className="MarkpromptSearchIcon" />
                </AccessibleIcon.Root>
              }
            />
          </BaseMarkprompt.Form>

          <AnswerOrSearchResults
            search={search}
            references={references}
            showSearch={showSearch}
            promptCTA={prompt?.cta}
            toggleSearchAnswer={toggle}
          />

          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root label={close?.label ?? 'Close Markprompt'}>
              <kbd>Esc</kbd>
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        </BaseMarkprompt.Content>
      </BaseMarkprompt.Portal>
    </BaseMarkprompt.Root>
  );
}

type AnswerOrSearchResultsProps = {
  references: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
  showSearch: boolean;
  promptCTA?: string;
  toggleSearchAnswer: () => void;
};

function AnswerOrSearchResults(
  props: AnswerOrSearchResultsProps,
): ReactElement {
  const { search, showSearch, promptCTA, toggleSearchAnswer, references } =
    props;

  if (!search?.enabled) {
    return (
      <AnswerContainer
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
          getResultHref={search.getResultHref}
          showSearch={showSearch}
          promptCTA={promptCTA}
          toggleSearchAnswer={toggleSearchAnswer}
        />
      </Transition>
      <Transition isVisible={!showSearch} isFlipped>
        <AnswerContainer
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
      tension: 640,
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
      <AccessibleIcon.Root label={trigger?.label ?? 'Open Markprompt'}>
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
  getResultHref?: (
    path: string,
    sectionHeading: BaseMarkprompt.SectionHeading | undefined,
    source: Source,
  ) => string;
  showSearch: boolean;
  promptCTA?: string;
  toggleSearchAnswer: () => void;
};

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const { showSearch, promptCTA, toggleSearchAnswer, getResultHref } = props;

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
      >
        <span aria-hidden className="MarkpromptSearchResultIconWrapper">
          <SparklesIcon focusable={false} className="MarkpromptSearchIcon" />
        </span>
        <span>{promptCTA || 'Ask Docs AI…'}</span>
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
            <SearchResult {...props} getHref={getResultHref} />
          )}
        />
      )}
    </div>
  );
}

type AnswerContainerProps = {
  isSearchEnabled?: boolean;
  references: MarkpromptOptions['references'];
  toggleSearchAnswer: () => void;
};

function AnswerContainer({
  isSearchEnabled,
  references,
  toggleSearchAnswer,
}: AnswerContainerProps): ReactElement {
  const { abort } = useMarkpromptContext();

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
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        referencesText={references?.referencesText}
        transformReferenceId={references?.transformReferenceId}
      />
    </div>
  );
}

export { Markprompt };
