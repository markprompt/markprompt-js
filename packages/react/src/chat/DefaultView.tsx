import { type ComponentType, type ReactElement } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import type { DefaultViewProps, MarkpromptOptions } from '../types.js';

export function DefaultMessage(props: {
  // message: string | ComponentType;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
}): ReactElement {
  if (typeof props.message === 'string') {
    // return <p className="MarkpromptDefaultViewMessage">{props.message}</p>;
    return (
      <AssistantMessage
        message={{ id: 'a-a-a-a-a', state: 'done', content: props.message }}
        projectKey={'asd'}
        chatOptions={{}}
        feedbackOptions={{}}
        linkAs={undefined}
      />
    );
  } else {
    const Message = props.message;
    return <Message />;
  }
}

export function DefaultPrompts(props: {
  // promptsHeading?: string;
  // prompts: string[];
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
}): ReactElement {
  if (props.prompts.length === 0) {
    return <></>;
  }
  return (
    <div className="MarkpromptDefaultViewMessagePromptsContainer">
      {props.promptsHeading && <h3>{props.promptsHeading}</h3>}
      {props.prompts.map((prompt, i) => {
        return (
          <a
            key={`markprompt-default-prompt-${i}`}
            onClick={() => {
              props.onDidSelectPrompt(prompt);
            }}
          >
            {prompt}
          </a>
        );
      })}
    </div>
  );
}

export function DefaultView(
  props: NonNullable<MarkpromptOptions['chat']> & {
    onDidSelectPrompt: (prompt: string) => void;
  },
): ReactElement {
  if (!props.defaultView?.message && !props.defaultView?.prompts) {
    return <div />;
  }

  return (
    <div className="MarkpromptDefaultView">
      {props.defaultView?.message && <DefaultMessage chatOptions={props} />}
      {props.prompts && (
        <DefaultPrompts
          prompts={props.prompts}
          promptsHeading={props.promptsHeading}
          onDidSelectPrompt={props.onDidSelectPrompt}
        />
      )}
    </div>
  );
}
