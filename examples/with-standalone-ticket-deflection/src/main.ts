import '@markprompt/css';
import './style.css';

import { ticketDeflectionForm } from '@markprompt/web';

const el = document.querySelector('#ticket-deflection-form');

const renderTicketDeflectionForm = async (): Promise<void> => {
  if (!el || !(el instanceof HTMLElement)) return;
  ticketDeflectionForm(el, {
    projectKey: import.meta.env.VITE_MARKPROMPT_PROJECT_KEY,
    apiUrl: 'http://api.localhost:3000',
  });
};

renderTicketDeflectionForm();
