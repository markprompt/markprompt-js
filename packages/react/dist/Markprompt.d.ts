import { FC } from 'react';
import type { OpenAIModelId } from '@markprompt/core';
type MarkpromptProps = {
    projectKey: string;
    model?: OpenAIModelId;
    iDontKnowMessage?: string;
    placeholder?: string;
    autoScrollDisabled?: boolean;
    didCompleteFirstQuery?: () => void;
    onDark?: boolean;
    completionsUrl?: string;
};
export declare const Markprompt: FC<MarkpromptProps>;
export default Markprompt;
