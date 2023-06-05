import type {
  SearchResult as TSearchResult,
  SearchResultSection as TSearchResultSection,
  SubmitPromptOptions,
} from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
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
  enableSearch?: boolean;
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

  const { enableSearch, submitPrompt, submitSearchQuery, prompt } =
    useMarkpromptContext();

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      // call user-provided onSubmit handler
      if (onSubmit) onSubmit(event);
      // submit search query if search is enabled
      if (enableSearch) {
        await submitSearchQuery(prompt);
        return;
      }
      // submit prompt if search is disabled
      await submitPrompt();
    },
    [enableSearch, onSubmit, prompt, submitPrompt, submitSearchQuery],
  );

  return <form {...rest} ref={ref} onSubmit={handleSubmit} />;
});
Form.displayName = 'Markprompt.Form';

const name = 'markprompt-prompt';
type PromptProps = ComponentPropsWithRef<'input'> & {
  label?: ReactNode;
  labelClassName?: string;
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
    ...rest
  } = props;

  const { updatePrompt, prompt, submitSearchQuery } = useMarkpromptContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      // we use the input value directly instead of using the prompt state
      // to avoid an off-by-one-bug when querying.
      submitSearchQuery(value);
      updatePrompt(value);
      if (onChange) onChange(event);
    },
    [onChange, submitSearchQuery, updatePrompt],
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

type SearchResultsProps = PolymorphicComponentPropWithRef<
  'ul',
  {
    SearchResultComponent?: ElementType<{
      result: TSearchResult;
      index: number;
    }>;
  }
>;

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  (props, ref) => {
    const {
      as: Component = 'ul',
      SearchResultComponent = SearchResult,
      ...rest
    } = props;
    const { searchResults } = useMarkpromptContext();
    return (
      <Component {...rest} ref={ref}>
        {searchResults.map((result, index) => (
          <SearchResultComponent
            key={result.path}
            index={index}
            result={result}
          />
        ))}
      </Component>
    );
  },
);
SearchResults.displayName = 'Markprompt.SearchResults';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  { result: TSearchResult }
>;
const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { as: Component = 'li', result, ...rest } = props;

    return (
      <Component {...rest} ref={ref}>
        <article>
          <ul>
            {result.sections.map((section) => (
              <SearchResultSection
                key={section.content}
                section={section}
                pageTitle={result.meta.title}
                pagePath={result.path}
              />
            ))}
          </ul>
        </article>
      </Component>
    );
  },
);
SearchResult.displayName = 'Markprompt.SearchResult';

type SearchResultSectionProps = Omit<
  ComponentPropsWithRef<'li'>,
  'children'
> & {
  pageTitle: string;
  pagePath: string;
  section: TSearchResultSection;
};

const SearchResultSection = forwardRef<HTMLLIElement, SearchResultSectionProps>(
  (props, ref) => {
    const { section, ...rest } = props;

    const Heading = useMemo(() => {
      const depth = section?.meta?.leadHeading?.depth;
      if (!depth) return;
      if (depth === 1) return 'h1';
      if (depth === 2) return 'h2';
      if (depth === 3) return 'h3';
      if (depth === 4) return 'h4';
      if (depth === 5) return 'h5';
      if (depth === 6) return 'h6';
    }, [section?.meta?.leadHeading?.depth]);

    return (
      <li {...rest} ref={ref}>
        {Heading && <Heading>{section.meta?.leadHeading?.value}</Heading>}
        <Markdown remarkPlugins={[remarkGfm]}>{section.content}</Markdown>
      </li>
    );
  },
);
SearchResultSection.displayName = 'Markprompt.SearchResultSection';

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
