import { Answer } from './answer.js';
import { Dialog } from './dialog.js';
import { Footer } from './footer.js';
import { Form } from './form.js';
import { ChatIcon, MarkpromptIcon, SearchIcon } from './icons.js';
import { Root } from './root.js';
import { Trigger } from './trigger.js';
import {
  type OpenEvent,
  type PromptEvent,
  type SubmitPromptEvent,
} from './types.js';

declare global {
  interface HTMLElementTagNameMap {
    'markprompt-answer': Answer;
    'markprompt-chat-icon': ChatIcon;
    'markprompt-dialog': Dialog;
    'markprompt-form': Form;
    'markprompt-footer': Footer;
    'markprompt-icon': MarkpromptIcon;
    'markprompt-root': Root;
    'markprompt-search-icon': SearchIcon;
    'markprompt-trigger': Trigger;
  }

  interface ElementEventMap {
    open: OpenEvent;
    prompt: PromptEvent;
    'submit-prompt': SubmitPromptEvent;
  }
}
