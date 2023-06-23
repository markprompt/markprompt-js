import { Markprompt } from '@markprompt/react';
import React, { ReactElement } from 'react';

export default function IndexPage(): ReactElement {
  return (
    <Markprompt
      projectKey={process.env.MARKPROMPT_PROJECT_KEY!}
      prompt={{
        iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
        promptTemplate: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, output in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".

  Context sections:
  ---
  {{CONTEXT}}

  Question: "{{PROMPT}}"

  Answer (including related code snippets if available):`,
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
        sectionsMatchCount: 10,
        sectionsMatchThreshold: 0.5,
      }}
    />
  );
}
