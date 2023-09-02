import './style.css';
import '@markprompt/css';
import { markpromptChat } from '@markprompt/web';

markpromptChat(import.meta.env.VITE_PROJECT_API_KEY, '#chat');
