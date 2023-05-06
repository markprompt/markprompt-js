import type { Options } from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
import * as React from 'react';
import { type ReactNode, createContext, forwardRef, useContext } from 'react';
import { Remark } from 'react-remark';

import { useMarkprompt } from './useMarkprompt.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export type RootProps = React.ComponentProps<typeof Dialog.Root> & {
  children: React.ReactNode;
  projectKey: string;
} & Options;

type State = {
  answer: string | undefined;
  prompt: string;
  references: string[];
  state: 'indeterminate' | 'loading' | 'success';
};

type Actions = {
  abort: () => void;
  updatePrompt: (nextPrompt: string) => void;
  submit: () => void;
};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  prompt: '',
  references: [],
  state: 'indeterminate',
  abort: noop,
  updatePrompt: noop,
  submit: noop,
});

function Root(props: RootProps) {
  const contextValue = useMarkprompt({
    projectKey: props.projectKey,
    completionsUrl: props.completionsUrl,
    frequencyPenalty: props.frequencyPenalty,
    iDontKnowMessage: props.iDontKnowMessage,
    includeBranding: props.includeBranding,
    loadingHeading: props.loadingHeading,
    maxTokens: props.maxTokens,
    model: props.model,
    placeholder: props.placeholder,
    presencePenalty: props.presencePenalty,
    promptTemplate: props.promptTemplate,
    referencesHeading: props.referencesHeading,
    temperature: props.temperature,
    topP: props.topP,
  });

  return (
    <MarkpromptContext.Provider value={contextValue}>
      <Dialog.Root modal>{props.children}</Dialog.Root>
    </MarkpromptContext.Provider>
  );
}

const Trigger = Dialog.Trigger;
Trigger.displayName = 'Markprompt.Trigger';

const Portal = Dialog.Portal;
Portal.displayName = 'Markprompt.Portal';

const Overlay = Dialog.Overlay;
Overlay.displayName = 'Markprompt.Overlay';

const Content = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog.Content>
>(function Content(props, ref) {
  const { state } = useContext(MarkpromptContext);
  return (
    <Dialog.Content {...props} data-loading-state={state} ref={ref}>
      {props.children}
    </Dialog.Content>
  );
});
Content.displayName = 'Markprompt.Content';

type CloseProps = React.ComponentProps<typeof Dialog.Close> & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props: CloseProps,
  ref,
) {
  const { onClick } = props;
  const { abort } = useContext(MarkpromptContext);
  return (
    <Dialog.Close
      {...props}
      ref={ref}
      onClick={(event) => {
        // abort ongoing fetch requests on close
        abort();
        // call user-provided onClick handler
        onClick?.(event);
      }}
    />
  );
});
Close.displayName = 'Markprompt.Close';

const Title = Dialog.Title;
Title.displayName = 'Markprompt.Title';

const Description = Dialog.Description;
Description.displayName = 'Markprompt.Description';

type FormProps = React.RefAttributes<HTMLFormElement> & {
  children?: ReactNode;
};

const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  const { submit } = useContext(MarkpromptContext);
  return (
    <form
      {...props}
      ref={ref}
      onSubmit={(event) => {
        event?.preventDefault();
        submit();
      }}
    />
  );
});
Form.displayName = 'Markprompt.Form';

type PromptProps = React.RefAttributes<HTMLInputElement> & {
  placeholder?: string;
  className?: string;
};

const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
  props,
  ref,
) {
  const { placeholder = 'Ask me anything…', className, ...rest } = props;
  const { updatePrompt, prompt } = useContext(MarkpromptContext);
  return (
    <input
      {...rest}
      className={className}
      placeholder={placeholder}
      ref={ref}
      type="text"
      value={prompt}
      onChange={(event) => updatePrompt(event.target.value)}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      spellCheck="false"
    />
  );
});
Prompt.displayName = 'Markprompt.Prompt';

function Answer(props: Omit<React.ComponentProps<typeof Remark>, 'children'>) {
  const { answer } = useContext(MarkpromptContext);
  return <Remark {...props}>{answer ?? ''}</Remark>;
}
Answer.displayName = 'Markprompt.Answer';

type ReferencesProps = {
  RootElement?: React.ElementType;
  ReferenceElement?: React.ElementType<{
    children: React.ReactNode;
    reference: string;
  }>;
};

const References = forwardRef<Element, ReferencesProps>(function References(
  props,
  ref,
) {
  const { RootElement = 'ul', ReferenceElement = 'li' } = props;
  const { references } = useContext(MarkpromptContext);
  return (
    <RootElement ref={ref} references={references}>
      {references.map((ref) => (
        <ReferenceElement key={ref} reference={ref}>
          {ref}
        </ReferenceElement>
      ))}
    </RootElement>
  );
});
References.displayName = 'Markprompt.References';

export {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
  Title,
  Description,
  Form,
  Prompt,
  Answer,
  References,
};
