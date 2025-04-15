import '@markprompt/css';
import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatProvider, useChatStore } from '@markprompt/react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const submitChat = useChatStore((state) => state.submitChat);
  const messages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);
  const setMessages = useChatStore((state) => state.setMessages);
  const submitToolCalls = useChatStore((state) => state.submitToolCalls);

  console.log('messages', JSON.stringify(messages, null, 2));
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    submitChat([{ role: 'user', content: input }]);
    setInput('');
  };

  const handleClear = () => {
    selectThread(undefined);
    setMessages([]);
  };

  const handleConfirmToolCall = (message: any) => {
    if (message.tool_calls && message.tool_calls.length > 0) {
      submitToolCalls(message);
    }
  };

  const handleCancelToolCall = (message: any) => {
    // Remove or hide the tool call message
    const updatedMessages = messages.filter((m) => m.id !== message.id);
    setMessages(updatedMessages);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </div>
      <div className="messages-container">
        {messages.map((message) => {
          const hasToolCalls =
            message.tool_calls && message.tool_calls.length > 0;

          return (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              {hasToolCalls ? (
                <div className="tool-confirmation">
                  <div className="tool-header">Confirm Action</div>
                  <div className="tool-description">
                    {message.tool_calls.map((toolCall: any, index: number) => (
                      <div key={index} className="tool-call">
                        <div className="tool-name">
                          {toolCall.function.name}
                        </div>
                        <div className="tool-args">
                          <pre>
                            {/* {JSON.stringify(
                              JSON.parse(toolCall.function.arguments),
                              null,
                              2,
                            )} */}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tool-actions">
                    <button
                      className="tool-confirm"
                      onClick={() => handleConfirmToolCall(message)}
                    >
                      Confirm
                    </button>
                    <button
                      className="tool-cancel"
                      onClick={() => handleCancelToolCall(message)}
                    >
                      Cancel
                    </button>
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

const App: React.FC = () => {
  return (
    <ChatProvider
      apiUrl={import.meta.env.VITE_MARKPROMPT_API_URL}
      projectKey={import.meta.env.VITE_PROJECT_API_KEY}
      chatOptions={{
        history: false,
        maxHistorySize: 10,
        assistantId: import.meta.env.VITE_ASSISTANT_ID,
      }}
    >
      <Chat />
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
