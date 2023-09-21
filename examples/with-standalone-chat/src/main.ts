import '@markprompt/css';
import './style.css';

import { markpromptChat } from '@markprompt/web';

const root = document.getElementById('markprompt-chat');

if (root) {
  markpromptChat(import.meta.env.VITE_MARKPROMPT_PROJECT_KEY, root, {
    chatOptions: {
      apiUrl: import.meta.env.VITE_MARKPROMPT_API_URL + '/v1/chat',
      history: true,
    },
  });
}
