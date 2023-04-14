import 'client-only';
import { OpenAIModelId } from '@markprompt/core';
import './markprompt-content';
declare global {
    interface Window {
        'markprompt-content': {
            projectKey: string;
            promptTemplate?: string;
            completionsUrl?: string;
            model?: OpenAIModelId;
            iDontKnowMessage?: string;
            placeholder?: string;
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