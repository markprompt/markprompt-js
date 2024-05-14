import '@markprompt/css';
import './style.css';

import { ticketDeflectionForm } from '@markprompt/web';

const el = document.querySelector('#ticket-deflection-form');

const renderTicketDeflectionForm = async () => {
  if (!el) return;
  ticketDeflectionForm(el, {
    projectKey: import.meta.env.VITE_MARKPROMPT_PROJECT_KEY,
  });
};

renderTicketDeflectionForm();
