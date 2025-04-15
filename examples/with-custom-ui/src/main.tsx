import '@markprompt/css';
import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatProvider, useChatStore } from '@markprompt/react';

const Chat = () => {
  const [input, setInput] = React.useState('');
  const submitChat = useChatStore((state) => state.submitChat);
  const chatMessages = useChatStore((state) => state.messages);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    submitChat([{ role: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {chatMessages.map((message) => (
          <div
            key={message.messageId}
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            {(message.content as string) ?? ''}
          </div>
        ))}
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
      {/* <ChatViewWithUpdateState
        page={page}
        assistantId={assistantId}
        assistantVersionId={assistantVersionId}
        placeholder={placeholder}
        autoGenerate={autoGenerate}
        caseContextPrompt={caseContextPrompt}
        hiddenFirstUserMessage={hiddenFirstUserMessage}
        cta={cta}
        noAvatars={noAvatars}
        showLastMessageOnly={showLastMessageOnly}
        showActions={showActions}
        hideFirstMessage={hideFirstMessage}
        clearShoulKeepFirstUserMessage={clearShoulKeepFirstUserMessage}
        loadingMessage={loadingMessage}
        shouldShowInsertDraftButton={shouldShowInsertDraftButton}
      /> */}
    </ChatProvider>
  );
};

// Render the app
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
