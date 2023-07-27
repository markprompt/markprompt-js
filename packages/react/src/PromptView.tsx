import React, { type ReactElement } from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { Feedback } from './Feedback.js';
import { MarkpromptForm } from './MarkpromptForm.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import { type MarkpromptOptions } from './types.js';

interface PromptViewProps {
  prompt: MarkpromptOptions['prompt'];
  feedback?: MarkpromptOptions['feedback'];
  references: MarkpromptOptions['references'];
  close?: MarkpromptOptions['close'];
  onDidSelectReference?: () => void;
}

export function PromptView(props: PromptViewProps): ReactElement {
  const { prompt, references, feedback, close, onDidSelectReference } = props;

  return (
    <div className="MarkpromptPromptView">
      <MarkpromptForm
        label={prompt?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!}
        placeholder={
          prompt?.placeholder ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.placeholder!
        }
        icon="prompt"
        close={close}
      />

      <AnswerContainer
        feedback={feedback}
        references={references}
        onDidSelectReference={onDidSelectReference}
      />
    </div>
  );
}

interface AnswerContainerProps {
  feedback?: MarkpromptOptions['feedback'];
  references: MarkpromptOptions['references'];
  onDidSelectReference?: () => void;
}

function AnswerContainer({
  feedback,
  references,
  onDidSelectReference,
}: AnswerContainerProps): ReactElement {
  const { state } = useMarkpromptContext();

  return (
    <div className="MarkpromptAnswerContainer">
      <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
        <Answer />
        {feedback?.enabled && state === 'done' && (
          <Feedback className="MarkpromptPromptFeedback" />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        transformReferenceId={references?.transformReferenceId}
        getLabel={references?.getLabel}
        getHref={references?.getHref}
        onDidSelectReference={onDidSelectReference}
      />
    </div>
  );
}
