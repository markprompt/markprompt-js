import { Markprompt } from '@markprompt/react';
import React, { ReactElement } from 'react';

export default function IndexPage(): ReactElement {
  return (
    <Markprompt
      projectKey={process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY!}
      prompt={{
        iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
        systemPrompt: `You are a very enthusiastic company representative who loves to help people!`,
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
        sectionsMatchCount: 10,
        sectionsMatchThreshold: 0.5,
      }}
      search={{
        enabled: false,
      }}
    />
  );
}
