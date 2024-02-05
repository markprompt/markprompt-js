import type { FileSectionReference } from '@markprompt/core';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import * as Dialog from '@radix-ui/react-dialog';
import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  memo,
  useCallback,
  useState,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import { ConditionalVisuallyHidden } from './ConditionalWrap.js';
import { Footer } from './footer.js';
import { CheckIcon, ClipboardIcon, CopyIcon, SendIcon } from '../icons.js';
import type {
  MarkpromptOptions,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
  SearchResultComponentProps,
} from '../types.js';
import type { ChatLoadingState } from '../index.js';
import type { PromptLoadingState } from '../prompt/usePrompt.js';

type RootProps = Dialog.DialogProps & { display?: 'plain' | 'dialog' };

/**
 * The Markprompt context provider and dialog root.
 */
function Root(props: RootProps): ReactElement {
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

function DialogRootWithAbort(props: Dialog.DialogProps): ReactElement {
  const { modal = true, ...rest } = props;
  return (
    <Dialog.Root {...rest} modal={modal}>
      {props.children}
    </Dialog.Root>
  );
}

type DialogTriggerProps = ComponentPropsWithRef<typeof Dialog.Trigger>;
/**
 * A button to open the Markprompt dialog.
 */
const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    return <Dialog.Trigger ref={ref} {...props} />;
  },
);
DialogTrigger.displayName = 'Markprompt.DialogTrigger';

type PortalProps = ComponentPropsWithoutRef<typeof Dialog.Portal>;
/**
 * The Markprompt dialog portal.
 */
function Portal(props: PortalProps): ReactElement {
  return <Dialog.Portal {...props} />;
}
Portal.displayName = 'Markprompt.Portal';

type OverlayProps = ComponentPropsWithRef<typeof Dialog.Overlay>;
/**
 * The Markprompt dialog overlay.
 */
const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
  return <Dialog.Overlay ref={ref} {...props} />;
});
Overlay.displayName = 'Markprompt.Overlay';

type ContentProps = ComponentPropsWithRef<typeof Dialog.Content> & {
  /**
   * Show the Markprompt footer.
   */
  branding?: { show?: boolean; type?: 'plain' | 'text' };
  /**
   * Show Algolia attribution in the footer.
   **/
  showAlgolia?: boolean;
};

/**
 * The Markprompt dialog content.
 */
const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content(props, ref) {
    const {
      branding = { show: true, type: 'plain' },
      showAlgolia,
      ...rest
    } = props;

    return (
      <Dialog.Content {...rest} ref={ref}>
        {props.children}
        {branding.show && (
          <Footer brandingType={branding.type} showAlgolia={showAlgolia} />
        )}
      </Dialog.Content>
    );
  },
);
Content.displayName = 'Markprompt.Content';

type PlainContentProps = ComponentPropsWithRef<'div'> & {
  /**
   * Show the Markprompt footer.
   */
  branding?: { show?: boolean; type?: 'plain' | 'text' };
  /**
   * Show Algolia attribution in the footer.
   **/
  showAlgolia?: boolean;
};

/**
 * The Markprompt plain content.
 */
const PlainContent = forwardRef<HTMLDivElement, PlainContentProps>(
  function PlainContent(props, ref) {
    const {
      branding = { show: true, type: 'plain' },
      showAlgolia,
      ...rest
    } = props;

    return (
      <div {...rest} ref={ref}>
        {props.children}
        {branding.show && (
          <Footer brandingType={branding.type} showAlgolia={showAlgolia} />
        )}
      </div>
    );
  },
);
PlainContent.displayName = 'Markprompt.PlainContent';

type CloseProps = ComponentPropsWithRef<typeof Dialog.Close>;
/**
 * A button to close the Markprompt dialog and abort an ongoing request.
 */
const Close = forwardRef<HTMLButtonElement, CloseProps>(
  function Close(props, ref) {
    return <Dialog.Close {...props} ref={ref} />;
  },
);
Close.displayName = 'Markprompt.Close';

type TitleProps = ComponentPropsWithRef<typeof Dialog.Title> & {
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

type DescriptionProps = ComponentPropsWithRef<typeof Dialog.Description> & {
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

type FormProps = ComponentPropsWithRef<'form'>;
/**
 * A form which, when submitted, submits the current prompt.
 */
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  return <form {...props} ref={ref} />;
});

type PromptProps = ComponentPropsWithRef<'input'> & {
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
  /** The label for the submit button. */
  buttonLabel?: string;
  /** Show an icon next to the send button, */
  showSubmitButton?: boolean;
};
/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
const Prompt = forwardRef<HTMLInputElement, PromptProps>(
  function Prompt(props, ref) {
    const {
      autoCapitalize = 'none',
      autoComplete = 'off',
      autoCorrect = 'off',
      autoFocus = true,
      label,
      buttonLabel = 'Send',
      labelClassName,
      placeholder,
      spellCheck = false,
      type = 'search',
      showSubmitButton = true,
      name,
      ...rest
    } = props;

    return (
      <>
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label}
          </label>
        )}
        <input
          {...rest}
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          spellCheck={spellCheck}
        />
        {showSubmitButton && (
          <button
            type="submit"
            disabled={(rest.value as string)?.trim()?.length === 0}
          >
            {buttonLabel}
            {/* <SendIcon /> */}
          </button>
        )}
      </>
    );
  },
);
Prompt.displayName = 'Markprompt.Prompt';

// TODO: find the right type definition for children. There is a mismatch
// between the type that react-markdown exposes, and what is actually
// serves.
interface CopyContentButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: string;
}

function CopyContentButton(props: CopyContentButtonProps): ReactElement {
  const { content } = props;
  const [didJustCopy, setDidJustCopy] = useState(false);

  const handleClick = (): void => {
    navigator.clipboard.writeText(content);
    setDidJustCopy(true);
    setTimeout(() => {
      setDidJustCopy(false);
    }, 2000);
  };

  return (
    <button
      className="MarkpromptGhostThumbButton"
      style={{ animationDelay: '100ms' }}
      data-active={false}
      onClick={handleClick}
    >
      <AccessibleIcon label={didJustCopy ? 'copied' : 'copy'}>
        <div style={{ position: 'relative' }}>
          <ClipboardIcon
            style={{ opacity: didJustCopy ? 0 : 1 }}
            width={16}
            height={16}
            strokeWidth={2}
          />
          <div style={{ position: 'absolute', inset: 0 }}>
            <CheckIcon
              style={{ opacity: didJustCopy ? 1 : 0 }}
              width={16}
              height={16}
              strokeWidth={2}
            />
          </div>
        </div>
      </AccessibleIcon>
    </button>
  );
}
CopyContentButton.displayName = 'Markprompt.CopyContentButton';

type HighlightedCodeProps = React.ClassAttributes<HTMLPreElement> &
  React.HTMLAttributes<HTMLPreElement> & {
    state: PromptLoadingState | ChatLoadingState;
  };

function HighlightedCode(props: HighlightedCodeProps) {
  const { children, className, state, ...rest } = props;

  useEffect(() => {
    if (state === 'done') {
      // If highlight.js script/css tags were added globally,
      // we can syntax highlight. This trick allows us to provide
      // syntax highlighting without imposing a large extra
      // package as part of the markprompt-js bundle.
      ((globalThis as any).hljs as any)?.highlightAll();
    }
  }, [children, state]);

  return (
    <pre {...rest} className={className}>
      {children}
    </pre>
  );
}

type AnswerProps = Omit<
  ComponentPropsWithoutRef<typeof Markdown>,
  'children'
> & {
  answer: string;
  state: PromptLoadingState | ChatLoadingState;
};

/**
 * Render the markdown answer from the Markprompt API.
 */
function Answer(props: AnswerProps): ReactElement {
  const { answer, state, remarkPlugins = [remarkGfm], ...rest } = props;

  return (
    <Markdown
      {...rest}
      remarkPlugins={remarkPlugins}
      components={{
        pre: (props) => {
          const { children, className, ...rest } = props;

          return (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  border: 0,
                }}
              >
                <CopyContentButton
                  content={
                    children &&
                    typeof children === 'object' &&
                    'props' in children
                      ? children.props.children
                      : ''
                  }
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
      {answer ?? ''}
    </Markdown>
  );
}
Answer.displayName = 'Markprompt.Answer';

type AutoScrollerProps = ComponentPropsWithRef<'div'> & {
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
};
/**
 * A component automatically that scrolls to the bottom.
 */
const AutoScroller = memo<AutoScrollerProps>(
  forwardRef<HTMLDivElement, AutoScrollerProps>((props, ref) => {
    const {
      // eslint-disable-next-line react/prop-types
      autoScroll = true,
      // eslint-disable-next-line react/prop-types
      scrollBehavior = 'smooth',
      // eslint-disable-next-line react/prop-types
      scrollTrigger,
      // eslint-disable-next-line react/prop-types
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

    useEffect(() => {
      // When scrollTrigger changes, potentially trigger scroll.
      perhapsScroll();
    }, [perhapsScroll, scrollTrigger]);

    useEffect(() => {
      // When discreteScrollTrigger changes (typically when a new message
      // is appended to the list of messages), reset the scroll lock, so
      // it can scroll down to the currently loading message.
      scrollLockOn.current = false;
      perhapsScroll();
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends ReferencesProps<TRoot, TReference> = { references: [] },
>(props: P, ref: PolymorphicRef<TRoot>): ReactElement {
  const {
    RootComponent = 'ul',
    ReferenceComponent = 'li',
    references = [],
  } = props;

  return (
    <RootComponent ref={ref}>
      {references.map((reference, index) => {
        return (
          <ReferenceComponent
            key={`${reference.file.path}-${index}`}
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
            <div className="MarkpromptSearchResultSectionHeading">
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

function ErrorMessage(props: ErrorMessageProps): ReactElement {
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
  type SearchResultProps,
  type SearchResultsProps,
  type TitleProps,
};
