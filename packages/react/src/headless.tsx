import type { Options } from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type FormEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type ElementType,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import {
  ConditionalVisuallyHidden,
  ConditionalWrap,
} from './ConditionalWrap.js';
import { Footer } from './footer.js';
import type { PolymorphicRef } from './types.js';
import { useMarkprompt, type LoadingState } from './useMarkprompt.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export type RootProps = ComponentPropsWithoutRef<typeof Dialog.Root> & {
  children: ReactNode;
  projectKey: string;
} & Options;

type State = {
  answer: string | undefined;
  prompt: string;
  references: string[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  submit: () => void;
  updatePrompt: (nextPrompt: string) => void;
};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  prompt: '',
  references: [],
  state: 'indeterminate',
  abort: noop,
  submit: noop,
  updatePrompt: noop,
});

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
  const { abort } = useContext(MarkpromptContext);

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

const Trigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<typeof Dialog.Trigger>
>((props, ref) => {
  return <Dialog.Trigger ref={ref} {...props} />;
});
Trigger.displayName = 'Markprompt.Trigger';

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
  const { state } = useContext(MarkpromptContext);

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
  const { abort } = useContext(MarkpromptContext);

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
  const { submit } = useContext(MarkpromptContext);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      submit();
      if (onSubmit) onSubmit(event);
    },
    [onSubmit, submit],
  );

  return <form {...rest} ref={ref} onSubmit={handleSubmit} />;
});
Form.displayName = 'Markprompt.Form';

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
    ...rest
  } = props;
  const { updatePrompt, prompt } = useContext(MarkpromptContext);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      updatePrompt(event.target.value);
      if (onChange) onChange(event);
    },
    [onChange, updatePrompt],
  );

  const name = 'markprompt-prompt';

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
        type="text"
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
  const { answer } = useContext(MarkpromptContext);
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
    const { answer } = useContext(MarkpromptContext);

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
  const { references } = useContext(MarkpromptContext);
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

export {
  Answer,
  AutoScroller,
  Close,
  Content,
  MarkpromptContext as Context,
  Description,
  Form,
  Overlay,
  Portal,
  Prompt,
  ForwardedReferences as References,
  Root,
  Title,
  Trigger,
};
