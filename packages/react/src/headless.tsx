import { OpenAIModelId } from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
import React, { createContext, forwardRef, useContext } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown.js';

import { useMarkprompt } from './useMarkprompt.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export type RootProps = React.ComponentProps<typeof Dialog.Root> & {
  children: React.ReactNode;
  projectKey: string;
  completionsUrl?: string;
  iDontKnowMessage?: string;
  model?: OpenAIModelId;
};

type State = {
  answer: string | undefined;
  loading: boolean;
  prompt: string;
  references: string[];
};

type Actions = {
  handlePromptChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  loading: false,
  prompt: '',
  references: [],
  handlePromptChange: noop,
  handleSubmit: noop,
});

function Root(props: RootProps) {
  const contextValue = useMarkprompt({
    projectKey: props.projectKey,
    completionsUrl: props.completionsUrl,
    iDontKnowMessage: props.iDontKnowMessage,
    model: props.model,
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

const Content = Dialog.Content;
Content.displayName = 'Markprompt.Content';

const Close = Dialog.Close;
Close.displayName = 'Markprompt.Close';

const Title = Dialog.Title;
Title.displayName = 'Markprompt.Title';

const Description = Dialog.Description;
Description.displayName = 'Markprompt.Description';

const Form = forwardRef<HTMLFormElement, React.RefAttributes<HTMLFormElement>>(
  function Form(props, ref) {
    const { handleSubmit } = useContext(MarkpromptContext);
    return <form {...props} ref={ref} onSubmit={handleSubmit} />;
  },
);
Form.displayName = 'Markprompt.Form';

type PromptProps = React.RefAttributes<HTMLInputElement> & {
  placeholder?: string;
};

const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
  props,
  ref,
) {
  const { placeholder = 'Ask me anything…', ...rest } = props;
  const { handlePromptChange, prompt } = useContext(MarkpromptContext);
  return (
    <input
      {...rest}
      placeholder={placeholder}
      ref={ref}
      type="text"
      value={prompt}
      onChange={handlePromptChange}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      spellCheck="false"
    />
  );
});
Prompt.displayName = 'Markprompt.Prompt';

function Answer(
  props: Exclude<React.ComponentProps<typeof ReactMarkdown>, 'children'>,
) {
  const { answer } = useContext(MarkpromptContext);
  if (!answer) return null;
  return <ReactMarkdown {...props}>{answer}</ReactMarkdown>;
}
Answer.displayName = 'Markprompt.Answer';

type ReferencesProps = React.RefAttributes<HTMLUListElement> & {
  Element?: React.ElementType;
  Reference?: React.ElementType;
};

const References = forwardRef<HTMLUListElement, ReferencesProps>(
  function References(props, ref) {
    const { Element = 'ul', Reference = 'li' } = props;
    const { references } = useContext(MarkpromptContext);
    if (references.length === 0) return null;
    return (
      <Element ref={ref}>
        {references.map((ref) => (
          <Reference key={ref} reference={ref}>
            {ref}
          </Reference>
        ))}
      </Element>
    );
  },
);

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
