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
import { ReactElement } from 'react-markdown/lib/react-markdown.js';

import {
  MarkpromptOptions,
  MarkpromptResponse,
  useMarkprompt,
} from './useMarkprompt.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

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

export type ProviderProps = Omit<MarkpromptOptions, 'prompt'> & {
  /**
   * The children to render within the markprompt context.
   */
  children: ReactNode;
};

/**
 * A provider for the Markprompt context.
 */
export function Provider(props: ProviderProps) {
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

export type FormProps = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>;

/**
 * The form that submits content to Markprompt.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  props,
  ref,
) {
  const { setPrompt } = useContext(MarkpromptContext);

  const handleSubmit: FormEventHandler<
    HTMLFormElement & { prompt: HTMLInputElement }
  > = (event) => {
    event.preventDefault();

    setPrompt(event.currentTarget.prompt.value);
  };

  return <form {...props} ref={ref} onSubmit={handleSubmit} />;
});

export type PromptProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'name'
  | 'type'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'spellCheck'
>;

/**
 * The input prompt.
 */
export const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
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

export type AnswerProps = Omit<ReactMarkdownOptions, 'children'>;

/**
 * Render the answer from a Markprompt response.
 */
export function Answer(props: AnswerProps): ReactElement | null {
  const { answer } = useContext(MarkpromptContext);

  if (!answer) {
    return null;
  }

  return <ReactMarkdown {...props}>{answer}</ReactMarkdown>;
}

export type ReferencesProps = {
  /**
   * The wrapper element to render.
   *
   * @default 'ul'
   */
  Element?: React.ElementType;

  /**
   * The element ro render for each reference.
   *
   * @default 'li'
   */
  Reference?: React.ElementType;
};

/**
 * Render the references that Markprompt replied with.
 */
export const References = forwardRef<HTMLUListElement, ReferencesProps>(
  function References({ Element = 'ul', Reference = 'li' }, ref) {
    const { references } = useContext(MarkpromptContext);

    if (references.length === 0) {
      return null;
    }

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
