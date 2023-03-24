import { I_DONT_KNOW, STREAM_SEPARATOR } from '@/lib/constants';
import cn from 'classnames';
import {
  FC,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import useProject from '@/lib/hooks/use-project';
import { getOrigin, timeout } from '@/lib/utils';

const Caret = () => {
  return (
    <i className="caret animate-caret inline-block h-[15px] w-[8px] translate-y-[2px] translate-x-[2px] transform rounded-[1px] bg-fuchsia-500 shadow-[0_0px_3px_0px_rgba(217,70,219,0.9)]" />
  );
};

type WithCaretProps = {
  Component: string;
  children?: ReactNode;
} & any;

const WithCaret: FC<WithCaretProps> = ({ Component, children, ...rest }) => {
  // Sometimes, react-markdown sends props of incorrect type,
  // causing React errors. To be safe, we normalize them here.
  const stringifiedProps = Object.keys(rest).reduce((acc, key) => {
    const value = rest[key];
    if (value === null || typeof value === 'undefined') {
      return acc;
    }
    return {
      ...acc,
      key: typeof value !== 'string' ? value.toString() : value,
    };
  }, {});

  return (
    <Component {...stringifiedProps} className="markdown-node">
      {children}
      <Caret />
    </Component>
  );
};

type PlaygroundProps = {
  didCompleteFirstQuery?: () => void;
  onDark?: boolean;
  autoScrollDisabled?: boolean;
  isDemoMode?: boolean;
  playing?: boolean;
  demoPrompt?: string;
  demoResponse?: string;
  demoReferences?: string[];
  iDontKnowMessage?: string;
};

export const Playground: FC<PlaygroundProps> = ({
  didCompleteFirstQuery,
  onDark,
  autoScrollDisabled,
  isDemoMode,
  playing,
  demoPrompt,
  demoResponse,
  demoReferences,
  iDontKnowMessage,
}) => {
  const { project } = useProject();
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const answerContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const _didCompleteFirstQuery = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const _iDontKnowMessage = iDontKnowMessage || I_DONT_KNOW;

  useEffect(() => {
    if (!playing || !demoResponse || !demoPrompt) {
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      inputRef.current?.focus();
      const promptChunks = demoPrompt.split('');
      await timeout(500);
      for (const prompt of promptChunks) {
        setPrompt((p) => (p ? p : '') + prompt);
        await timeout(Math.random() * 10 + 30);
      }

      await timeout(500);
      setLoading(true);
      await timeout(2000);
      const responseChunks = demoResponse.split(' ');
      for (const chunk of responseChunks) {
        setAnswer((a) => a + chunk + ' ');
        await timeout(Math.random() * 10 + 70);
      }
      setLoading(false);
      await timeout(500);
      setReferences(demoReferences || []);
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playing, demoResponse, demoPrompt, demoReferences]);

  const setAnswerAnimated = useCallback(async (answer: string) => {
    const responseChunks = answer.split(' ');
    for (const chunk of responseChunks) {
      setAnswer((a) => a + chunk + ' ');
      await timeout(Math.random() * 10 + 70);
    }
  }, []);

  const submitPrompt = useCallback(
    async (e: SyntheticEvent<EventTarget>) => {
      e.preventDefault();

      if (!prompt || !project?.id || isDemoMode) {
        return;
      }

      setAnswer('');
      setReferences([]);
      setLoading(true);

      try {
        const res = await fetch(
          `${getOrigin('api')}/completions/${project.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              iDontKnowMessage: _iDontKnowMessage,
            }),
          },
        );

        if (!res.ok || !res.body) {
          const text = await res.text();
          console.error('Error:', text);
          await setAnswerAnimated(_iDontKnowMessage);
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let startText = '';
        let didHandleHeader = false;
        let refs: string[] = [];

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          if (!didHandleHeader) {
            startText = startText + chunkValue;
            if (startText.includes(STREAM_SEPARATOR)) {
              const parts = startText.split(STREAM_SEPARATOR);
              try {
                refs = JSON.parse(parts[0]);
              } catch {}
              setAnswer((prev) => prev + parts[1]);
              didHandleHeader = true;
            }
          } else {
            setAnswer((prev) => prev + chunkValue);
          }
        }
        setReferences(refs);
      } catch (e) {
        console.error('Error', e);
        await setAnswerAnimated(_iDontKnowMessage);
      }
      setLoading(false);
    },
    [prompt, project?.id, isDemoMode, _iDontKnowMessage, setAnswerAnimated],
  );

  useEffect(() => {
    if (
      autoScrollDisabled ||
      !containerRef.current ||
      !answerContainerRef.current
    ) {
      return;
    }

    const childRect = answerContainerRef.current.getBoundingClientRect();
    containerRef.current.scrollTop = childRect.bottom;
  }, [answer, loading, autoScrollDisabled, references]);

  useEffect(() => {
    if (!loading && answer.length > 0) {
      // This gets called after an answer has completed.
      if (!_didCompleteFirstQuery.current) {
        _didCompleteFirstQuery.current = true;
        didCompleteFirstQuery?.();
      }
    }
  }, [loading, answer, didCompleteFirstQuery]);

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-12 border-b border-neutral-900">
        <form onSubmit={submitPrompt}>
          <input
            ref={inputRef}
            value={prompt || ''}
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className={cn(
              'w-full appearance-none rounded-md border-0 bg-transparent px-0 pt-1 pb-2 text-neutral-300 outline-none transition duration-500 placeholder:text-neutral-500 focus:outline-none focus:ring-0',
              {
                'pointer-events-none': isDemoMode && playing,
              },
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            autoFocus={false}
          />
        </form>
      </div>
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t',
          {
            'from-neutral-1000 to-neutral-1000/0': !onDark,
            'from-neutral-1100 to-neutral-1100/0': onDark,
          },
        )}
      />
      <div
        ref={containerRef}
        className="hidden-scrollbar prose prose-sm absolute inset-x-0 bottom-0 top-12 z-0 max-w-full overflow-y-auto scroll-smooth py-4 pb-8 dark:prose-invert"
      >
        {loading && !(answer.length > 0) && <Caret />}
        {/* Need a container for ReactMarkdown to be able to access
            :last-child and display the caret */}
        <div
          className={cn('prompt-answer', {
            'prompt-answer-done': !loading,
            'prompt-answer-loading': loading,
          })}
        >
          <ReactMarkdown
            components={{
              p: (props) => <WithCaret Component="p" {...props} />,
              span: (props) => <WithCaret Component="span" {...props} />,
              h1: (props) => <WithCaret Component="h1" {...props} />,
              h2: (props) => <WithCaret Component="h2" {...props} />,
              h3: (props) => <WithCaret Component="h3" {...props} />,
              h4: (props) => <WithCaret Component="h4" {...props} />,
              h5: (props) => <WithCaret Component="h5" {...props} />,
              h6: (props) => <WithCaret Component="h6" {...props} />,
              pre: (props) => <WithCaret Component="pre" {...props} />,
              code: (props) => <WithCaret Component="code" {...props} />,
              td: (props) => <WithCaret Component="td" {...props} />,
              li: (props) => <WithCaret Component="li" {...props} />,
            }}
            remarkPlugins={[remarkGfm]}
          >
            {answer}
          </ReactMarkdown>
        </div>
        {answer.length > 0 && references.length > 0 && (
          <div className="mt-8 border-t border-neutral-900 pt-4 text-sm text-neutral-500">
            <div className="animate-slide-up">
              Summary generated from the following sources:
              <div className="mt-4 flex w-full flex-row flex-wrap items-center gap-2">
                {references.map((r) => (
                  <div
                    key={`reference-${r}`}
                    className="cursor-pointer rounded-md border border-neutral-900 bg-neutral-1100 px-2 py-1 text-sm font-medium text-neutral-300 transition hover:border-neutral-800 hover:text-neutral-200"
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="h-8" />
        <div ref={answerContainerRef} />
      </div>
    </div>
  );
};
