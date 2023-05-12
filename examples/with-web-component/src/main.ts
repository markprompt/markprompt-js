import './style.css';
import '@markprompt/web';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <p>press the button ↘️</p>
  <markprompt-root project-key="sk_test_mKfzAaRVAZaVvu0MHJvGNJBywfJSOdp4" model="gpt-4"></markprompt-root>
`;
