import type { AnimatedFooter } from './animated-footer.js';
import { Answer } from './answer.js';
import { Autoscroller } from './autoscroller.js';
import { Caret } from './caret.js';
import { Dialog } from './dialog.js';
import { Footer } from './footer.js';
import { Form } from './form.js';
import { ChatIcon, MarkpromptIcon, SearchIcon } from './icons.js';
import { Loading } from './loading.js';
import { References } from './references.js';
import { Root } from './root.js';
import { Trigger } from './trigger.js';
import {
  type OpenEvent,
  type PromptEvent,
  type SubmitPromptEvent,
} from './types.js';

declare global {
  interface HTMLElementTagNameMap {
    'markprompt-animated-footer': AnimatedFooter;
    'markprompt-answer': Answer;
    'markprompt-autoscroller': Autoscroller;
    'markprompt-caret': Caret;
    'markprompt-chat-icon': ChatIcon;
    'markprompt-dialog': Dialog;
    'markprompt-footer': Footer;
    'markprompt-form': Form;
    'markprompt-icon': MarkpromptIcon;
    'markprompt-loading': Loading;
    'markprompt-references': References;
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
