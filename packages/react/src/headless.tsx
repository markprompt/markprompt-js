import type { SubmitPromptOptions } from '@markprompt/core';
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (onSubmit) onSubmit(event);
    },
    [onSubmit],
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

  const debouncedSubmitSearchQuery = useCallback(
    (searchQuery: string) => debounce(submitSearchQuery, 300)(searchQuery),
    [submitSearchQuery],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      console.log('change', event.target.value);
      updatePrompt(event.target.value);
      debouncedSubmitSearchQuery(event.target.value);
      if (onChange) onChange(event);
    },
    [debouncedSubmitSearchQuery, onChange, updatePrompt],
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

const PromptTrigger = forwardRef<
  HTMLButtonElement,
  PolymorphicComponentPropWithRef<'button'>
>((props, ref) => {
  const { as: Component = 'button', onClick, type = 'submit', ...rest } = props;
  const { submitPrompt } = useMarkpromptContext();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (onClick) onClick(event);
      submitPrompt();
    },
    [onClick, submitPrompt],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent | KeyboardEvent) => {
      console.log(event);
      if (event.key === 'Enter') {
        event.preventDefault();
        submitPrompt();
      }
    },
    [submitPrompt],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Component
      {...rest}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type={type}
      ref={ref}
    />
  );
});
PromptTrigger.displayName = 'Markprompt.PromptTrigger';

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

const SearchResults = forwardRef<
  HTMLUListElement,
  Omit<ComponentPropsWithRef<'ul'>, 'children'>
>((props, ref) => {
  const { searchResults } = useMarkpromptContext();
  return (
    <div>
      <ul {...props} ref={ref}>
        {searchResults.map((result) => {
          return (
            <li key={result.path}>
              <article>
                <h2>{result.meta.title}</h2>
                <ul>
                  {result.sections.map((section) => (
                    <li key={section.content}>
                      {section.heading && <h3>{section.heading}</h3>}
                      <p>{section.content}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
SearchResults.displayName = 'Markprompt.SearchResults';

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
  PromptTrigger,
  Root,
  SearchResults,
  Title,
};
