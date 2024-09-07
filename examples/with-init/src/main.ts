import './style.css';

// @ts-expect-error - Markprompt types have not been included here
window.markprompt = {
  projectKey: import.meta.env.VITE_PROJECT_API_KEY,
  options: {
    chat: {
      assistantId: import.meta.env.VITE_ASSISTANT_ID,
    },
  },
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p>Open the Markprompt dialog ↘️</p>
  </div>
`;
