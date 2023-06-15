import * as Dialog from '@radix-ui/react-dialog';
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
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import { ConditionalVisuallyHidden } from './ConditionalWrap.js';
import { MarkpromptContext, useMarkpromptContext } from './context.js';
import { Footer } from './footer.js';
import type { PolymorphicRef } from './types.js';
import { useMarkprompt, type UseMarkpromptOptions } from './useMarkprompt.js';

type RootProps = ComponentPropsWithoutRef<typeof Dialog.Root> &
  UseMarkpromptOptions & {
    children: ReactNode;
  };

/**
 * The Markprompt context provider and dialog root.
 */
function Root(props: RootProps): ReactElement {
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

function DialogRootWithAbort(props: Dialog.DialogProps): ReactElement {
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

type TriggerProps = ComponentPropsWithRef<typeof Dialog.Trigger>;
/**
 * A button to open the Markprompt dialog.
 */
const Trigger = forwardRef<HTMLButtonElement, TriggerProps>((props, ref) => {
  return <Dialog.Trigger ref={ref} {...props} />;
});
Trigger.displayName = 'Markprompt.Trigger';

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
  showBranding?: boolean;
};

/**
 * The Markprompt dialog content.
 */
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

type CloseProps = ComponentPropsWithRef<typeof Dialog.Close>;
/**
 * A button to close the Markprompt dialog and abort an ongoing request.
 */
const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props,
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
/**
 * A visually hidden aria description.
 */
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
/**
 * A form which, when submitted, submits the current prompt.
 */
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  const { onSubmit, ...rest } = props;
  const { submit } = useMarkpromptContext();

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
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
};
/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
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
  const { updatePrompt, prompt } = useMarkpromptContext();

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
/**
 * Render the markdown answer from the Markprompt API.
 */
function Answer(props: AnswerProps): ReactElement {
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
};
/**
 * A component automatically that scrolls to the bottom.
 */
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
};

/**
 * Render the references that Markprompt returns.
 */
const References = function References<
  TRoot extends ElementType,
  TReference extends ElementType<{
    referenceId: string;
    index: number;
  }>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends ReferencesProps<TRoot, TReference> = {},
>(props: P, ref: PolymorphicRef<TRoot>): ReactElement {
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
/**
 * Render the references that Markprompr returned.
 */
const ForwardedReferences = forwardRef(References);
ForwardedReferences.displayName = 'Markprompt.References';

export {
  Answer,
  type AnswerProps,
  AutoScroller,
  type AutoScrollerProps,
  Close,
  type CloseProps,
  Content,
  type ContentProps,
  Description,
  type DescriptionProps,
  Form,
  type FormProps,
  Overlay,
  type OverlayProps,
  Portal,
  type PortalProps,
  Prompt,
  type PromptProps,
  ForwardedReferences as References,
  type ReferencesProps,
  Root,
  type RootProps,
  Title,
  type TitleProps,
  Trigger,
  type TriggerProps,
};
