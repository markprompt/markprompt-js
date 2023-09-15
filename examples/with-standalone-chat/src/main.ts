import '@markprompt/css';
import './style.css';

import { markpromptChat } from '@markprompt/web';

markpromptChat(
  import.meta.env.VITE_MARKPROMPT_PROJECT_KEY,
  document.getElementById('markprompt-chat'),
);
