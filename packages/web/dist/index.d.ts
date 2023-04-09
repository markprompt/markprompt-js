import 'client-only';
import { OpenAIModelId } from '@markprompt/core';
import './markprompt-content.js';
declare global {
    interface Window {
        markprompt: {
            projectKey: string;
            completionsUrl?: string;
            model?: OpenAIModelId;
            iDontKnowMessage?: string;
            placeholder?: string;
            dark?: boolean;
            accentColor?: string;
            idToRefMap?: {
                [key: string]: {
                    label: string;
                    href: string;
                };
            };
        };
    }
}
//# sourceMappingURL=index.d.ts.map