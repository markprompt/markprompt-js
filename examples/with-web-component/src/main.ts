import './style.css';
import '@markprompt/web';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <p>Press the button ↘️</p>
  <markprompt-root project-key="${
    import.meta.env.VITE_PROJECT_API_KEY
  }" model="gpt-4"></markprompt-root>
`;
