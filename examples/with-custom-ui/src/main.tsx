import '@markprompt/css';
import './style.css';
import React, {
  type FC,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom/client';
import { ChatProvider, useChatStore } from '@markprompt/react';
import ReactMarkdown from 'react-markdown';

const sampleProjects = [
  {
    id: 'eagle-mint-river',
    name: 'Blog',
  },
  {
    id: 'orbit-silver-branch',
    name: 'Marketing Site',
  },
  {
    id: 'crimson-leaf-harbor',
    name: 'Web App',
  },
];

const ProjectSelector = ({
  active,
  onDidSelectProject,
}: {
  active: boolean;
  onDidSelectProject: (id: string) => void;
}) => {
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined,
  );
  return (
    <div>
      <h3 className="tool-heading">Please select your project</h3>
      <select
        disabled={!active}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option>Select a project</option>
        {sampleProjects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="tool-confirm"
        onClick={() => selectedProject && onDidSelectProject(selectedProject)}
        disabled={!selectedProject || !active}
      >
        Select
      </button>
    </div>
  );
};

const Chat = ({
  onDidSelectProject,
}: {
  onDidSelectProject: (id: string) => void;
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const submitChat = useChatStore((state) => state.submitChat);
  const messages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);
  const setMessages = useChatStore((state) => state.setMessages);
  const submitToolCalls = useChatStore((state) => state.submitToolCalls);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('messages', JSON.stringify(messages, null, 2));
  }, [messages.map((m) => m.state).join(':')]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    submitChat([{ role: 'user', content: input }]);
    setInput('');
  };

  const handleClear = () => {
    selectThread(undefined);
    setMessages([]);
  };

  const handleSelectProject = useCallback(
    (message: any, id: string) => {
      onDidSelectProject(id);
      submitToolCalls(message);
    },
    [submitToolCalls, onDidSelectProject],
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button type="button" className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </div>
      <div className="messages-container">
        {messages.map((message, i) => {
          const isLoading =
            message.role === 'assistant' &&
            (message.state === 'indeterminate' || message.state === 'preload');

          const hasToolCalls =
            message.role === 'assistant' &&
            message.tool_calls &&
            message.tool_calls.length > 0;

          if (message.role === 'tool') {
            // Do not show tool confirmation
            return null;
          }

          return (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${isLoading ? 'loading' : ''}`}
            >
              {hasToolCalls ? (
                <div className="tool-confirmation">
                  <div className="tool-description">
                    <ProjectSelector
                      // Disable if there are subsequent messages
                      active={!messages[i + 1]}
                      onDidSelectProject={(projectId) =>
                        handleSelectProject(message, projectId)
                      }
                    />
                  </div>
                </div>
              ) : isLoading ? (
                <div className="loading-indicator">
                  <div className="loading-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              ) : (
                <ReactMarkdown className="markdown-content">
                  {(message.content as string) ?? ''}
                </ReactMarkdown>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button className="chat-submit-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

const App: FC = () => {
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const projectName = sampleProjects.find((p) => p.id === projectId)?.name;

  return (
    <ChatProvider
      apiUrl={import.meta.env.VITE_MARKPROMPT_API_URL}
      projectKey={import.meta.env.VITE_PROJECT_API_KEY}
      chatOptions={{
        assistantId: import.meta.env.VITE_ASSISTANT_ID,
        toolChoice: 'auto',
        // If projectId is set, we don't allow to trigger the tool call
        tools: projectId
          ? []
          : [
              {
                tool: {
                  type: 'function',
                  function: { name: 'askForProjectId' },
                },
                call: () => Promise.resolve('The project id was provided.'),
              },
            ],
        context: { projectId, projectName },
      }}
    >
      <Chat onDidSelectProject={setProjectId} projectId={projectId} />
    </ChatProvider>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    ReactDOM.createRoot(appContainer).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
});
