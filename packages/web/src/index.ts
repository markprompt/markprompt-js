import 'client-only';

import { OpenAIModelId } from '@markprompt/core';
import './markprompt-content';

declare global {
  interface Window {
    'markprompt-content': {
      projectKey: string;
      completionsUrl?: string;
      model?: OpenAIModelId;
      iDontKnowMessage?: string;
      placeholder?: string;
      idToRefMap?: { [key: string]: { label: string; href: string } };
    };
  }
}

// const required = ['projectKey'] as const;
// const optional = [
//   'completionsUrl',
//   'dark',
//   'iDontKnowMessage',
//   'model',
//   'placeholder',
// ];

// (async () => {
//   const root = document.createElement('markprompt-content');
//   // const markprompt = window.markprompt;

//   // for (let key of required) {
//   //   if (!markprompt?.[key]) {
//   //     throw new Error(`Missing Markprompt configuration option: ${key}`);
//   //   }

//   //   root.setAttribute(key, markprompt[key]);
//   // }

//   // for (let key of optional) {
//   //   if (!markprompt?.[key]) continue;
//   //   root.setAttribute(key, markprompt[key]);
//   // }

//   document.body.appendChild(root);
// })();
