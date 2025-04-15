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
  const chatMessages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);
  const setMessages = useChatStore((state) => state.setMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="clear-button" onClick={handleClear}>Clear</button>
      </div>
      <div className="messages-container">
        {chatMessages.map((message) => (
          <div
            key={message.messageId}
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <ReactMarkdown className="markdown-content">
              {(message.content as string) ?? ''}
            </ReactMarkdown>
          </div>
        ))}
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
