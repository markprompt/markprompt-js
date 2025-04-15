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
      <div
        className="messages-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {chatMessages.map((message) => (
          <div
            key={message.messageId}
            className={`message ${message.role}`}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              maxWidth: '80%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' ? '#0084ff' : '#f0f0f0',
              color: message.role === 'user' ? 'white' : 'black',
            }}
          >
            {(message.content as string) ?? ''}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: '1px solid #eee',
          padding: '12px',
          display: 'flex',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #eee',
            borderRadius: '4px',
            marginRight: '8px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'semibold',
          }}
        >
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
