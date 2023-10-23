import { Markprompt } from '@markprompt/react';
import React, { ReactElement } from 'react';

export default function IndexPage(): ReactElement {
  return (
    <Markprompt
      projectKey={process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY!}
      chat={{
        enabled: true,
        apiUrl: `${process.env.NEXT_PUBLIC_MARKPROMPT_API_URL}/v1/chat`,
        iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
        systemPrompt:
          'You are a very enthusiastic company representative who loves to help people!',
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
        sectionsMatchCount: 10,
        sectionsMatchThreshold: 0.5,
        defaultView: {
          message: 'Welcome to the Markprompt AI chatbot!',
          prompts: [
            'What is Markpormpt?',
            'Is React supported?',
            'Is there an API?',
          ],
        },
      }}
      search={{
        enabled: false,
      }}
    />
  );
}
