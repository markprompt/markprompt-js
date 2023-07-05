import React, { type ReactElement } from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { ChevronLeftIcon } from './icons.js';
import { MarkpromptForm } from './MarkpromptForm.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import { type MarkpromptOptions } from './types.js';

interface PromptViewProps {
  handleViewChange?: () => void;
  prompt: MarkpromptOptions['prompt'];
  references: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
}

export function PromptView(props: PromptViewProps): ReactElement {
  const { prompt, references, search, handleViewChange } = props;
  return (
    <div className="MarkpromptPromptView">
      <MarkpromptForm
        label={prompt?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!}
        placeholder={
          prompt?.placeholder ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.placeholder!
        }
      />

      <AnswerContainer
        handleViewChange={handleViewChange}
        isSearchEnabled={search?.enabled}
        references={references}
      />
    </div>
  );
}

interface AnswerContainerProps {
  handleViewChange?: () => void;
  isSearchEnabled?: boolean;
  references: MarkpromptOptions['references'];
}

function AnswerContainer({
  handleViewChange,
  isSearchEnabled,
  references,
}: AnswerContainerProps): ReactElement {
  const { abort } = useMarkpromptContext();

  return (
    <div className="MarkpromptAnswerContainer">
      {isSearchEnabled && (
        <button
          className="MarkpromptBackButton"
          onClick={() => {
            abort();
            handleViewChange?.();
          }}
        >
          <span aria-hidden>
            <ChevronLeftIcon className="MarkpromptHighlightedIcon" />
          </span>
          <span>Back to search</span>
        </button>
      )}

      <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
        <Answer />
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        referencesText={references?.referencesText}
        transformReferenceId={references?.transformReferenceId}
      />
    </div>
  );
}
