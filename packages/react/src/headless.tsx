import React, {
  createContext,
  forwardRef,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  FormEventHandler,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';
import ReactMarkdown, { Options as ReactMarkdownOptions } from 'react-markdown';

import {
  MarkpromptOptions,
  MarkpromptResponse,
  useMarkprompt,
} from './useMarkprompt.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type RootProps = Omit<MarkpromptOptions, 'prompt'> & {
  children: ReactNode;
  projectKey: string;
};

type MarkpromptContext = MarkpromptResponse & {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
};

const MarkpromptContext = createContext<MarkpromptContext>({
  answer: '',
  loading: false,
  references: [],
  prompt: '',
  setPrompt: noop,
});

function Root(props: RootProps) {
  const [prompt, setPrompt] = useState('');

  const value = useMarkprompt({
    prompt,
    projectKey: props.projectKey,
    completionsUrl: props.completionsUrl,
    iDontKnowMessage: props.iDontKnowMessage,
    model: props.model,
  });

  return (
    <MarkpromptContext.Provider value={{ ...value, prompt, setPrompt }}>
      {props.children}
    </MarkpromptContext.Provider>
  );
}

type FormProps = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>;

const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  const { setPrompt } = useContext(MarkpromptContext);

  const handleSubmit: FormEventHandler<
    HTMLFormElement & { prompt: HTMLInputElement }
  > = (event) => {
    event.preventDefault();

    setPrompt(event.currentTarget.prompt.value);
  };

  return <form {...props} ref={ref} onSubmit={handleSubmit} />;
});

type PromptProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'name'
  | 'type'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'spellCheck'
>;

const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
  props,
  ref,
) {
  return (
    <input
      placeholder="Ask me anything…"
      {...props}
      name="prompt"
      ref={ref}
      type="text"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      spellCheck="false"
    />
  );
});

type AnswerProps = Omit<ReactMarkdownOptions, 'children'>;

function Answer(props: AnswerProps) {
  const { answer } = useContext(MarkpromptContext);
  if (!answer) return null;
  return <ReactMarkdown {...props}>{answer}</ReactMarkdown>;
}

type ReferencesProps = {
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

export { Root, Form, Prompt, Answer, References };
