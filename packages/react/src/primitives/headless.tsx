import type { FileSectionReference } from '@markprompt/core/types';
import * as Dialog from '@radix-ui/react-dialog';
import {
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type ElementType,
  type FormEventHandler,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import TextareaAutoSize from 'react-textarea-autosize';
import remarkGfm from 'remark-gfm';

import { ConditionalVisuallyHidden } from './ConditionalWrap.js';
import { CheckIcon, ClipboardIcon } from '../icons.js';
import type {
  ChatLoadingState,
  MarkpromptDisplay,
  MarkpromptOptions,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
  SearchResultComponentProps,
} from '../types.js';

type RootProps = Omit<Dialog.DialogProps, 'onOpenChange'> & {
  display?: MarkpromptDisplay;
  onOpenChange?: (this: void, open: boolean) => void;
};

/**
 * The Markprompt context provider and dialog root.
 */
function Root(props: RootProps): JSX.Element {
  const {
    children,
    display = 'dialog',
    defaultOpen,
    modal,
    onOpenChange,
    open,
  } = props;

  if (display === 'plain') {
    return <>{children}</>;
  }

  return (
    <DialogRootWithAbort
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={onOpenChange}
      open={open}
    >
      {children}
    </DialogRootWithAbort>
  );
}

function DialogRootWithAbort(props: Dialog.DialogProps): JSX.Element {
  const { modal = true, ...rest } = props;
  return (
    <Dialog.Root {...rest} modal={modal}>
      {props.children}
    </Dialog.Root>
  );
}

type DialogTriggerProps = ComponentProps<typeof Dialog.Trigger>;
/**
 * A button to open the Markprompt dialog.
 */
const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    return <Dialog.Trigger ref={ref} {...props} />;
  },
);
DialogTrigger.displayName = 'Markprompt.DialogTrigger';

type PortalProps = ComponentProps<typeof Dialog.Portal>;
/**
 * The Markprompt dialog portal.
 */
function Portal(props: PortalProps): JSX.Element {
  return <Dialog.Portal {...props} />;
}
Portal.displayName = 'Markprompt.Portal';

type OverlayProps = ComponentProps<typeof Dialog.Overlay>;
/**
 * The Markprompt dialog overlay.
 */
const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
  return <Dialog.Overlay ref={ref} {...props} />;
});
Overlay.displayName = 'Markprompt.Overlay';

type ContentProps = ComponentProps<typeof Dialog.Content>;

/**
 * The Markprompt dialog content.
 */
const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content(props, ref) {
    return (
      <Dialog.Content {...props} ref={ref}>
        {props.children}
      </Dialog.Content>
    );
  },
);
Content.displayName = 'Markprompt.Content';

export interface BrandingProps {
  /**
   * Show the Markprompt footer.
   **/
  branding?: { show?: boolean; type?: 'plain' | 'text' };
}

type PlainContentProps = ComponentProps<'div'>;
/**
 * The Markprompt plain content.
 */
const PlainContent = forwardRef<HTMLDivElement, PlainContentProps>(
  function PlainContent(props, ref) {
    return (
      <div {...props} ref={ref}>
        {props.children}
      </div>
    );
  },
);
PlainContent.displayName = 'Markprompt.PlainContent';

type CloseProps = ComponentProps<typeof Dialog.Close>;
/**
 * A button to close the Markprompt dialog and abort an ongoing request.
 */
const Close = forwardRef<HTMLButtonElement, CloseProps>(
  function Close(props, ref) {
    return <Dialog.Close {...props} ref={ref} />;
  },
);
Close.displayName = 'Markprompt.Close';

type TitleProps = ComponentProps<typeof Dialog.Title> & {
  hide?: boolean;
};
const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const { hide, ...rest } = props;
  return (
    <ConditionalVisuallyHidden hide={hide} asChild>
      <Dialog.Title {...rest} ref={ref} />
    </ConditionalVisuallyHidden>
  );
});
Title.displayName = 'Markprompt.Title';

type DescriptionProps = ComponentProps<typeof Dialog.Description> & {
  hide?: boolean;
};
/**
 * A visually hidden aria description.
 */
const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  (props, ref) => {
    const { hide, ...rest } = props;
    return (
      <ConditionalVisuallyHidden hide={hide} asChild>
        <Dialog.Description {...rest} ref={ref} />
      </ConditionalVisuallyHidden>
    );
  },
);
Description.displayName = 'Markprompt.Description';

type FormProps = ComponentProps<'form'>;
/**
 * A form which, when submitted, submits the current prompt.
 */
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  return <form {...props} ref={ref} />;
});

interface PromptBaseProps {
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
  /** The class name of the text area container. */
  textAreaContainerClassName?: string;
  /** The class name of the send button element. */
  sendButtonClassName?: string;
  /** The label for the submit button. */
  buttonLabel?: string;
  /** Show an icon next to the send button. */
  showSubmitButton?: boolean;
  /** If the answer is loading. */
  isLoading?: boolean;
  /** Icon for the button. */
  Icon?: ReactNode;
  /** Minimum number of rows. */
  minRows?: number;
  /** Use an input field instead of a text area. */
  onSubmit?: FormEventHandler<HTMLFormElement>;
  /** Submit on enter. */
  submitOnEnter?: boolean;
}

type PromptProps = ComponentProps<'textarea'> & PromptBaseProps;

/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
const Prompt = forwardRef<HTMLTextAreaElement, PromptProps>(
  function Prompt(props, ref) {
    const {
      autoCapitalize = 'none',
      autoComplete = 'off',
      autoCorrect = 'off',
      autoFocus = true,
      label,
      buttonLabel = 'Send',
      labelClassName,
      textAreaContainerClassName,
      sendButtonClassName,
      placeholder,
      spellCheck = false,
      showSubmitButton = true,
      isLoading,
      Icon,
      name,
      className,
      minRows,
      submitOnEnter,
      onSubmit,
      onKeyDown,
      ...rest
    } = props;

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === 'Enter' && !event.shiftKey) {
          if (submitOnEnter !== false) {
            event.preventDefault();
            onSubmit?.(event);
          } else if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            onSubmit?.(event);
          }
        }
      },
      [onSubmit, submitOnEnter],
    );

    return (
      <>
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label}
          </label>
        )}
        <div className={textAreaContainerClassName}>
          <TextareaAutoSize
            {...rest}
            id={name}
            name={name}
            minRows={minRows}
            placeholder={placeholder}
            ref={ref}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            spellCheck={spellCheck}
            className={className}
            draggable={false}
            style={{ resize: 'none', height: '100%' as unknown as number }}
            onKeyDown={handleKeyDown}
          />
        </div>
        {showSubmitButton && (
          <button
            className={sendButtonClassName}
            type="submit"
            data-variant="primary"
            disabled={
              isLoading ||
              ((rest.value as string)?.trim()?.length === 0 && !isLoading)
            }
          >
            {buttonLabel}
            {Icon}
          </button>
        )}
      </>
    );
  },
);
Prompt.displayName = 'Markprompt.Prompt';

interface SearchPromptBaseProps {
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
  /** The class name of the input container. */
  containerClassName?: string;
  /** The class name of the send button element. */
  sendButtonClassName?: string;
  /** The label for the submit button. */
  buttonLabel?: string;
  /** Show an icon next to the send button. */
  showSubmitButton?: boolean;
  /** If the answer is loading. */
  isLoading?: boolean;
  /** Icon for the button. */
  Icon?: ReactNode;
  /**
   * Prompt type
   * @defaults search
   */
  type?: 'search' | 'input';
}

type SearchPromptProps = ComponentProps<'input'> & SearchPromptBaseProps;

/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
const SearchPrompt = forwardRef<HTMLInputElement, SearchPromptProps>(
  function Prompt(props, ref) {
    const {
      autoCapitalize = 'none',
      autoComplete = 'off',
      autoCorrect = 'off',
      autoFocus = true,
      label,
      buttonLabel = 'Send',
      labelClassName,
      sendButtonClassName,
      containerClassName,
      placeholder,
      spellCheck = false,
      type = 'search',
      showSubmitButton = true,
      isLoading,
      Icon,
      name,
      className,
      onKeyDown,
      ...rest
    } = props;

    return (
      <>
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label}
          </label>
        )}
        <div className={containerClassName}>
          <input
            {...rest}
            id={name}
            name={name}
            type="search"
            placeholder={placeholder}
            ref={ref}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={autoCorrect}
            // biome-ignore lint/a11y/noAutofocus: we sometimes want to autofocus the search input
            autoFocus={autoFocus}
            spellCheck={spellCheck}
            className={className}
            draggable={false}
            style={{ resize: 'none', height: '100%' }}
            onKeyDown={onKeyDown}
          />
        </div>
        {showSubmitButton && (
          <button
            className={sendButtonClassName}
            type="submit"
            data-variant="primary"
            disabled={
              isLoading ||
              ((rest.value as string)?.trim()?.length === 0 && !isLoading)
            }
          >
            {buttonLabel}
            {Icon}
          </button>
        )}
      </>
    );
  },
);
Prompt.displayName = 'Markprompt.Prompt';

// between the type that react-markdown exposes, and what is actually
// serves.
interface CopyContentButtonProps {
  content: string;
  className?: string;
}

function CopyContentButton(props: CopyContentButtonProps): JSX.Element {
  const { content, className } = props;
  const [didJustCopy, setDidJustCopy] = useState(false);

  const handleClick = (): void => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setDidJustCopy(true);
        const id = setTimeout(() => {
          setDidJustCopy(false);
        }, 2000);
        return id;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <button
      className={className}
      style={{ animationDelay: '100ms' }}
      data-active={false}
      onClick={handleClick}
      aria-live="polite"
      aria-label={didJustCopy ? 'copied' : 'copy'}
      type="button"
    >
      <div style={{ position: 'relative' }}>
        <ClipboardIcon
          style={{ opacity: didJustCopy ? 0 : 1 }}
          width={16}
          height={16}
          strokeWidth={2}
          aria-hidden
        />
        <div style={{ position: 'absolute', inset: 0 }}>
          <CheckIcon
            style={{ opacity: didJustCopy ? 1 : 0 }}
            width={16}
            height={16}
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </div>
    </button>
  );
}
CopyContentButton.displayName = 'Markprompt.CopyContentButton';

type HighlightedCodeProps = ComponentProps<'pre'> & {
  state?: ChatLoadingState;
};

declare global {
  interface hljs {
    highlightAll: () => void;
  }

  var hljs: hljs | undefined;
}

function HighlightedCode(props: HighlightedCodeProps): JSX.Element {
  const { children, className, state, ...rest } = props;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run the effect when children/state changes
  useEffect(() => {
    if (state === 'done') {
      // If highlight.js script/css tags were added globally,
      // we can syntax highlight. This trick allows us to provide
      // syntax highlighting without imposing a large extra
      // package as part of the markprompt-js bundle.
      if (
        globalThis.hljs &&
        typeof globalThis.hljs.highlightAll === 'function'
      ) {
        globalThis.hljs.highlightAll();
      }
    }
  }, [children, state]);

  return (
    <pre style={{ overflow: 'auto' }} {...rest} className={className}>
      {children}
    </pre>
  );
}

type AnswerProps = Omit<ComponentProps<typeof Markdown>, 'children'> & {
  content: string;
  state?: ChatLoadingState;
  copyButtonClassName?: string;
  linkAs?: string | ComponentType<unknown>;
};

/**
 * Render the markdown answer from the Markprompt API.
 */
function Answer(props: AnswerProps): JSX.Element {
  const {
    content,
    state,
    copyButtonClassName,
    remarkPlugins = [remarkGfm],
    linkAs,
    ...rest
  } = props;

  const LinkComponent = linkAs ?? 'a';

  return (
    <Markdown
      {...rest}
      remarkPlugins={remarkPlugins}
      components={{
        a: (props: ComponentProps<'a'>) => <LinkComponent {...props} />,
        pre: (props: ComponentProps<'pre'>) => {
          const { children, className, ...rest } = props;

          let content = '';

          if (
            children &&
            typeof children === 'object' &&
            'props' in children &&
            typeof children.props === 'object' &&
            children.props !== null &&
            'children' in children.props &&
            isValidElement(children.props.children) &&
            typeof children.props.children === 'string'
          ) {
            content = children.props.children;
          }

          return (
            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  border: 0,
                }}
              >
                <CopyContentButton
                  className={copyButtonClassName}
                  content={content}
                />
              </div>
              <HighlightedCode {...rest} className={className} state={state}>
                {children}
              </HighlightedCode>
            </div>
          );
        },
      }}
    >
      {content ?? ''}
    </Markdown>
  );
}
Answer.displayName = 'Markprompt.Answer';

interface AutoScrollerInnerProps {
  /**
   * Whether or not to enable automatic scrolling.
   *
   * @default true
   */
  autoScroll?: boolean;

  /**
   * The behaviour to use for scrolling.
   *
   * @default 'smooth'
   */
  scrollBehavior?: ScrollBehavior;

  /**
   * The element scrolls when this prop changes, unless scroll
   * lock is enabled.
   * @default undefined
   * */
  scrollTrigger?: unknown;
  /**
   * The element scrolls when this prop changes, overriding
   * scroll lock.
   * @default number
   * */
  discreteScrollTrigger?: number;
}

type AutoScrollerProps = ComponentProps<'div'> & AutoScrollerInnerProps;

/**
 * A component that automatically scrolls to the bottom.
 */
const AutoScroller = memo<AutoScrollerProps>(
  forwardRef<HTMLDivElement, AutoScrollerProps>((props, ref) => {
    const {
      autoScroll = true,
      scrollBehavior = 'smooth',
      scrollTrigger,
      discreteScrollTrigger,
      ...rest
    } = props;
    const localRef = useRef<HTMLDivElement>(null);
    const scrollLockOn = useRef<boolean>(false);
    const didScrollOnce = useRef<boolean>(false);

    const perhapsScroll = useCallback(() => {
      if (!localRef.current) return;
      if (!autoScroll) return;
      if (scrollLockOn.current) return;
      localRef.current.scrollTo({
        top: localRef.current.scrollHeight,
        behavior: didScrollOnce.current ? scrollBehavior : 'instant',
      });
      didScrollOnce.current = true;
    }, [autoScroll, scrollBehavior]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run the effect when scrollTrigger changes
    useEffect(() => {
      // When scrollTrigger changes, potentially trigger scroll.
      // Scroll immediately (e.g. when opening an existing chat), and
      // also after a small delay in case other DOM nodes (such as references)
      // are appended.
      perhapsScroll();
      setTimeout(perhapsScroll, 400);
    }, [perhapsScroll, scrollTrigger]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run the effect when discreteScrollTrigger changes
    useEffect(() => {
      // When discreteScrollTrigger changes (typically when a new message
      // is appended to the list of messages), reset the scroll lock, so
      // it can scroll down to the currently loading message.
      scrollLockOn.current = false;
      perhapsScroll();
      setTimeout(perhapsScroll, 400);
    }, [discreteScrollTrigger, perhapsScroll]);

    const handleScroll = (): void => {
      if (!localRef.current) {
        return;
      }

      const element = localRef.current;

      // Check if user has scrolled away from the bottom. Note that the
      // autoscroll may leave a pixel of space, so we give it a 10 pixel
      // buffer.
      const relativeScrollHeight = element.scrollHeight - element.scrollTop;
      if (Math.abs(relativeScrollHeight - element.clientHeight) > 10) {
        scrollLockOn.current = true;
      } else {
        scrollLockOn.current = false;
      }
    };

    return (
      <div ref={mergeRefs([ref, localRef])} {...rest} onScroll={handleScroll} />
    );
  }),
);
AutoScroller.displayName = 'Markprompt.AutoScroller';

export interface ReferencesInnerProps {
  /**
   * The wrapper component to render.
   * @default 'ul'
   */
  RootComponent?: ElementType;
  /**
   * The component to render for each reference.
   * @default 'li'
   */
  ReferenceComponent?: ElementType;
  /**
   * The references to display.
   */
  references: FileSectionReference[];
}

interface ReferencesProps<
  TRoot extends ElementType,
  TReference extends ElementType<{
    reference: FileSectionReference;
    index: number;
  }>,
> {
  /**
   * The wrapper component to render.
   * @default 'ul'
   */
  RootComponent?: TRoot;

  /**
   * The component to render for each reference.
   * @default 'li'
   */
  ReferenceComponent?: TReference;
  references: FileSectionReference[];
}

/**
 * Render the references that Markprompt returns.
 */
const References = function References<
  TRoot extends ElementType,
  TReference extends ElementType<{
    reference: FileSectionReference;
    index: number;
  }>,
  P extends ReferencesProps<TRoot, TReference> = { references: [] },
>(props: P, ref: PolymorphicRef<TRoot>): JSX.Element {
  const {
    RootComponent = 'ul',
    ReferenceComponent = 'li',
    references = [],
  } = props;

  return (
    <RootComponent ref={ref}>
      {references.slice(0, 5).map((reference, index) => {
        return (
          <ReferenceComponent
            key={`${reference.file.path}-${reference.meta?.leadHeading?.id}`}
            reference={reference}
            index={index}
          />
        );
      })}
    </RootComponent>
  );
};
/**
 * Render the references that Markprompt returned.
 */
const ForwardedReferences = forwardRef(References);
ForwardedReferences.displayName = 'Markprompt.References';

type SearchResultsProps = PolymorphicComponentPropWithRef<
  'ul',
  {
    label?: string;
    SearchResultComponent?: ElementType<
      SearchResultComponentProps & { index?: number }
    >;
    searchResults: SearchResultComponentProps[];
    searchOptions?: MarkpromptOptions['search'];
    headingClassName?: string;
  }
>;

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  (props, ref) => {
    const {
      as: Component = 'ul',
      label = 'Search results',
      SearchResultComponent = SearchResult,
      searchResults,
      searchOptions,
      headingClassName,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        ref={ref}
        role="listbox"
        id="markprompt-search-results"
        tabIndex={0}
        aria-label={label}
      >
        {searchResults.map((result, index) => {
          const id = `markprompt-result-${index}`;
          return (
            <SearchResultComponent
              id={id}
              index={index}
              key={id}
              role="option"
              {...result}
            />
          );
        })}
        {searchOptions?.defaultView?.searches?.length &&
          searchOptions?.defaultView?.searchesHeading && (
            <div className={headingClassName}>
              {searchOptions.defaultView.searchesHeading}
            </div>
          )}
        {searchOptions?.defaultView?.searches?.map((result, index) => {
          const adjustedIndex = index + searchResults.length;
          const id = `markprompt-result-${adjustedIndex}`;
          return (
            <SearchResultComponent
              id={id}
              index={adjustedIndex}
              key={id}
              role="option"
              {...result}
            />
          );
        })}
      </Component>
    );
  },
);
SearchResults.displayName = 'Markprompt.SearchResults';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  SearchResultComponentProps & {
    onMouseMove?: () => void;
    onClick?: () => void;
  }
>;

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { title, href, ...rest } = props;
    return (
      <li ref={ref} {...rest}>
        <a href={href}>{title}</a>
      </li>
    );
  },
);
SearchResult.displayName = 'Markprompt.SearchResult';

interface ErrorMessageProps {
  className?: string;
  children: ReactNode;
}

function ErrorMessage(props: ErrorMessageProps): JSX.Element {
  const { className, children } = props;
  return (
    <div className={className}>
      <p>{children}</p>
    </div>
  );
}
ErrorMessage.displayName = 'Markprompt.ErrorMessage';

export {
  Answer,
  AutoScroller,
  Close,
  Content,
  CopyContentButton,
  Description,
  DialogTrigger,
  ErrorMessage,
  Form,
  Overlay,
  PlainContent,
  Portal,
  Prompt,
  ForwardedReferences as References,
  Root,
  SearchPrompt,
  SearchResult,
  SearchResults,
  Title,
  type AnswerProps,
  type AutoScrollerProps,
  type CloseProps,
  type ContentProps,
  type DescriptionProps,
  type DialogTriggerProps,
  type ErrorMessageProps,
  type FormProps,
  type OverlayProps,
  type PortalProps,
  type PromptProps,
  type ReferencesProps,
  type RootProps,
  type SearchPromptProps,
  type SearchResultProps,
  type SearchResultsProps,
  type TitleProps,
};
