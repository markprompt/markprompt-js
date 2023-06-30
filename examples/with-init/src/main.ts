import './style.css';

window.markprompt = {
  projectKey: import.meta.env.VITE_PROJECT_API_KEY,
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p>Open the Markprompt dialog ↘️</p>
  </div>
`;

await import('@markprompt/css');
await import('@markprompt/web/init');
