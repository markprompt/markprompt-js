import type {
  SearchResult as TSearchResult,
  SearchResultSection as TSearchResultSection,
  SubmitPromptOptions,
} from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
import Slugger from 'github-slugger';
import debounce from 'p-debounce';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type FormEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
  useMemo,
  type ForwardedRef,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import { ConditionalVisuallyHidden } from './ConditionalWrap.js';
import { MarkpromptContext, useMarkpromptContext } from './context.js';
import { Footer } from './footer.js';
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from './types.js';
import { useMarkprompt } from './useMarkprompt.js';

export type RootProps = ComponentPropsWithoutRef<typeof Dialog.Root> & {
  children: ReactNode;
  projectKey: string;
  isSearchEnabled?: boolean;
  isSearchActive?: boolean;
} & SubmitPromptOptions;

function Root(props: RootProps) {
  const {
    children,
    defaultOpen,
    modal,
    onOpenChange,
    open,
    ...markpromptOptions
  } = props;

  const contextValue = useMarkprompt(markpromptOptions);

  return (
    <MarkpromptContext.Provider value={contextValue}>
      <DialogRootWithAbort
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </DialogRootWithAbort>
    </MarkpromptContext.Provider>
  );
}

function DialogRootWithAbort(props: Dialog.DialogProps) {
  const { onOpenChange, modal = true, ...rest } = props;
  const { abort } = useMarkpromptContext();

  const handleOpenChange: NonNullable<Dialog.DialogProps['onOpenChange']> =
    useCallback(
      (open) => {
        if (!open) abort();
        if (onOpenChange) onOpenChange(open);
      },
      [abort, onOpenChange],
    );

  return (
    <Dialog.Root {...rest} modal={modal} onOpenChange={handleOpenChange}>
      {props.children}
    </Dialog.Root>
  );
}

const DialogTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<typeof Dialog.Trigger>
>((props, ref) => {
  return <Dialog.Trigger ref={ref} {...props} />;
});
DialogTrigger.displayName = 'Markprompt.DialogTrigger';

function Portal(props: ComponentPropsWithoutRef<typeof Dialog.Portal>) {
  return <Dialog.Portal {...props} />;
}
Portal.displayName = 'Markprompt.Portal';

const Overlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithRef<typeof Dialog.Overlay>
>((props, ref) => {
  return <Dialog.Overlay ref={ref} {...props} />;
});
Overlay.displayName = 'Markprompt.Overlay';

type ContentProps = ComponentPropsWithRef<typeof Dialog.Content> & {
  showBranding?: boolean;
};

const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  props,
  ref,
) {
  const { showBranding = true } = props;
  const { state } = useMarkpromptContext();

  return (
    <Dialog.Content {...props} ref={ref} data-loading-state={state}>
      {props.children}
      {showBranding && <Footer />}
    </Dialog.Content>
  );
});
Content.displayName = 'Markprompt.Content';

type CloseProps = ComponentPropsWithRef<typeof Dialog.Close> & {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};
const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props: CloseProps,
  ref,
) {
  const { onClick, ...rest } = props;
  const { abort } = useMarkpromptContext();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      // abort ongoing fetch requests on close
      abort();
      // call user-provided onClick handler
      if (onClick) onClick(event);
    },
    [abort, onClick],
  );

  return <Dialog.Close {...rest} ref={ref} onClick={handleClick} />;
});
Close.displayName = 'Markprompt.Close';

type TitleProps = ComponentPropsWithRef<typeof Dialog.Title> & {
  hide?: boolean;
};
const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const { hide } = props;
  return (
    <ConditionalVisuallyHidden hide={hide}>
      <Dialog.Title {...props} ref={ref} />
    </ConditionalVisuallyHidden>
  );
});
Title.displayName = 'Markprompt.Title';

type DescriptionProps = ComponentPropsWithRef<typeof Dialog.Description> & {
  hide?: boolean;
};
const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  (props, ref) => {
    const { hide } = props;
    return (
      <ConditionalVisuallyHidden hide={hide}>
        <Dialog.Description {...props} ref={ref} />
      </ConditionalVisuallyHidden>
    );
  },
);
Description.displayName = 'Markprompt.Description';

type FormProps = ComponentPropsWithRef<'form'>;
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  const { onSubmit, ...rest } = props;

  const {
    isSearchEnabled,
    isSearchActive,
    submitPrompt,
    submitSearchQuery,
    prompt,
  } = useMarkpromptContext();

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      // call user-provided onSubmit handler
      if (onSubmit) {
        onSubmit(event);
      }

      // submit search query if search is enabled
      if (isSearchEnabled && isSearchActive) {
        await submitSearchQuery(prompt);
      } else {
        // submit prompt if search is disabled
        await submitPrompt();
      }
    },
    [
      isSearchEnabled,
      isSearchActive,
      onSubmit,
      prompt,
      submitPrompt,
      submitSearchQuery,
    ],
  );

  return <form {...rest} ref={ref} onSubmit={handleSubmit} />;
});
Form.displayName = 'Markprompt.Form';

const name = 'markprompt-prompt';
type PromptProps = ComponentPropsWithRef<'input'> & {
  label?: ReactNode;
  labelClassName?: string;
  shouldSubmitSearchOnInputChange?: boolean;
};
const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
  props,
  ref,
) {
  const {
    autoCapitalize = 'none',
    autoComplete = 'off',
    autoCorrect = 'off',
    autoFocus = true,
    label,
    labelClassName,
    onChange,
    placeholder = 'Ask me anything…',
    spellCheck = false,
    type = 'search',
    shouldSubmitSearchOnInputChange = false,
    ...rest
  } = props;

  const { updatePrompt, prompt, submitSearchQuery } = useMarkpromptContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      // We use the input value directly instead of using the prompt state
      // to avoid an off-by-one-bug when querying.
      if (shouldSubmitSearchOnInputChange) {
        submitSearchQuery(value);
      }
      updatePrompt(value);
      if (onChange) {
        onChange(event);
      }
    },
    [
      onChange,
      submitSearchQuery,
      updatePrompt,
      shouldSubmitSearchOnInputChange,
    ],
  );

  return (
    <>
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      <input
        {...rest}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
        type={type}
        value={prompt}
        onChange={handleChange}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        spellCheck={spellCheck}
      />
    </>
  );
});
Prompt.displayName = 'Markprompt.Prompt';

type AnswerProps = Omit<ComponentPropsWithoutRef<typeof Markdown>, 'children'>;
function Answer(props: AnswerProps) {
  const { remarkPlugins = [remarkGfm], ...rest } = props;
  const { answer } = useMarkpromptContext();
  return (
    <Markdown {...rest} remarkPlugins={remarkPlugins}>
      {answer ?? ''}
    </Markdown>
  );
}
Answer.displayName = 'Markprompt.Answer';

type AutoScrollerProps = ComponentPropsWithRef<'div'> & {
  autoScroll?: boolean;
  scrollBehavior?: ScrollBehavior;
};
const AutoScroller = forwardRef<HTMLDivElement, AutoScrollerProps>(
  (props, ref) => {
    const { autoScroll = true, scrollBehavior = 'smooth' } = props;
    const localRef = useRef<HTMLDivElement>(null);
    const { answer } = useMarkpromptContext();

    useEffect(() => {
      if (!localRef.current) return;
      if (!autoScroll) return;
      localRef.current.scrollTo({
        top: localRef.current.scrollHeight,
        behavior: scrollBehavior,
      });
    }, [answer, autoScroll, scrollBehavior]);

    return <div ref={mergeRefs([ref, localRef])} {...props} />;
  },
);
AutoScroller.displayName = 'Markprompt.AutoScroller';

type ReferencesProps<
  TRoot extends ElementType,
  TReference extends ElementType<{
    referenceId: string;
    index: number;
  }>,
> = {
  RootComponent?: TRoot;
  ReferenceComponent?: TReference;
};

const References = function References<
  TRoot extends ElementType,
  TReference extends ElementType<{
    referenceId: string;
    index: number;
  }>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends ReferencesProps<TRoot, TReference> = {},
>(props: P, ref: PolymorphicRef<TRoot>) {
  const { RootComponent = 'ul', ReferenceComponent = 'li' } = props;
  const { references } = useMarkpromptContext();
  return (
    <RootComponent ref={ref}>
      {references.map((reference, index) => {
        return (
          <ReferenceComponent
            key={reference}
            referenceId={reference}
            index={index}
          />
        );
      })}
    </RootComponent>
  );
};
const ForwardedReferences = forwardRef(References);
ForwardedReferences.displayName = 'Markprompt.References';

type SearchResultData = {
  isPage?: boolean;
  isIndented?: boolean;
  path?: string;
  tag?: string;
  title?: string;
  score: number;
};

type SearchResultsProps = PolymorphicComponentPropWithRef<
  'ul',
  {
    SearchResultComponent?: ElementType<SearchResultData>;
  }
>;

function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

function removeFirstLine(text: string) {
  const firstLineBreakIndex = text.indexOf('\n');
  if (firstLineBreakIndex === -1) {
    return '';
  }
  return text.substring(firstLineBreakIndex + 1);
}

function trimContent(text: string) {
  return text.replace(/^\s+/, '').replace(/\s+$/, '');
}

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  (props, ref) => {
    const {
      as: Component = 'ul',
      SearchResultComponent = SearchResult,
      ...rest
    } = props;
    const { searchResults, prompt: searchTerm } = useMarkpromptContext();

    const flattenedResults: SearchResultData[] = useMemo(() => {
      const slugger = new Slugger();

      const sortedSearchResults = [...searchResults].sort((f1, f2) => {
        const f1TopSectionScore = Math.max(...f1.sections.map((s) => s.score));
        const f2TopSectionScore = Math.max(...f2.sections.map((s) => s.score));
        return f2TopSectionScore - f1TopSectionScore;
      });

      // The final list is built as follows:
      // - If the title matches the search term, include a search result
      //   with the title itself, and no sections
      // - If the title matches the search term, we may also get a bunch of
      //   sections without the search term, because of the title match.
      //   So we remove all the sections that don't include the search term
      //   in the content and meta.leadHeading
      // - All other sections (with matches on search term) are added
      const normalizedSearchTerm = searchTerm.toLowerCase();
      return sortedSearchResults.flatMap((f) => {
        const isMatchingTitle =
          f.meta?.title?.toLowerCase()?.indexOf(normalizedSearchTerm) >= 0;

        const sectionResults = [
          ...f.sections
            .map((s) => {
              const isMatchingLeadHeading =
                (s.meta?.leadHeading?.value
                  ?.toLowerCase()
                  ?.indexOf(normalizedSearchTerm) || -1) >= 0;

              // Fast and hacky way to remove the lead heading from
              // the content, which we don't want to be part of the snippet
              const trimmedContent = trimContent(
                s.meta?.leadHeading
                  ? removeFirstLine(trimContent(s.content?.trim() || ''))
                  : s.content || '',
              );

              const isMatchingContent =
                trimmedContent.toLowerCase().indexOf(normalizedSearchTerm) >= 0;

              if (!isMatchingLeadHeading && !isMatchingContent) {
                // If this is a result because of the title only, omit
                // it from here.
                return undefined;
              }

              if (isMatchingLeadHeading) {
                // If matching lead heading, show that as title
                return {
                  isPage: false,
                  title: trimContent(s.meta?.leadHeading?.value || ''),
                  score: s.score,
                  path: `${f.path}#${slugger.slug(
                    s.meta?.leadHeading?.value || '',
                  )}`,
                };
              }

              if (!trimmedContent) {
                return undefined;
              }
              return {
                isPage: false,
                tag: f.meta.title,
                title: trimmedContent,
                score: s.score,
                path: f.path,
              };
            })
            .filter(isPresent),
        ].sort((s1, s2) => s2.score - s1.score);

        if (isMatchingTitle) {
          const topSectionScore = sectionResults[0]?.score;
          return [
            {
              isPage: true,
              title: f.meta.title,
              score: topSectionScore,
              path: f.path,
            },
            // Indent results if they have a matching parent page
            ...sectionResults.map((s) => {
              return {
                ...s,
                isIndented: true,
              };
            }),
          ];
        } else {
          return sectionResults;
        }
      });
    }, [searchResults, searchTerm]);

    console.log('flattenedResults', JSON.stringify(flattenedResults, null, 2));

    return (
      <Component {...rest} ref={ref}>
        {flattenedResults.map((result, i) => (
          <SearchResultComponent key={`${result.path}:${i}`} {...result} />
        ))}
      </Component>
    );
  },
);
SearchResults.displayName = 'Markprompt.SearchResults';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  SearchResultData
>;
const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { title } = props;

    return <li ref={ref}>{title}</li>;
  },
);
SearchResult.displayName = 'Markprompt.SearchResult';

export {
  Answer,
  AutoScroller,
  Close,
  Content,
  Description,
  DialogTrigger,
  Form,
  ForwardedReferences as References,
  Overlay,
  Portal,
  Prompt,
  Root,
  SearchResults,
  Title,
};
