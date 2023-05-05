import {
  Root,
  Trigger,
  Description,
  Title,
  Portal,
  Overlay,
  Content,
  Close,
} from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

import {
  Answer,
  Form,
  Prompt,
  Provider,
  type ProviderProps,
} from './context.js';
import { MarkpromptIcon } from './icon.js';

export type MarkpromptDialogProps = Omit<ProviderProps, 'children'> & {
  /**
   * A class name for the close button of the dialog.
   */
  closeButtonClassName?: string;

  /**
   * A class name for the dialog content.
   */
  contentClassName?: string;

  /**
   * An aria description of the dialog. This is also used as a placeholder for the input.
   *
   * @default 'Ask me a question…'
   */
  description?: string;

  /**
   * An aria label for the trigger button
   *
   * @default 'Open markprompt'
   */
  label?: string;

  /**
   * A class name for the overlay of the dialog.
   */
  overlayClassName?: string;

  /**
   * A class name for the input prompt.
   */
  promptClassName?: string;

  /**
   * An aria title for the dialog.
   */
  title?: string;

  /**
   * A class name for the dialog trigger.
   */
  triggerClassName?: string;

  /**
   * A class name for the icon on the dialog trigger.
   */
  triggerIconClassName?: string;
};

/**
 * Render a trigger button. If the button is clicked, a dialog opens with a Markprompt dialog.
 */
export function MarkpromptDialog({
  closeButtonClassName,
  completionsUrl,
  contentClassName,
  description = 'Ask me a question…',
  iDontKnowMessage,
  label = 'Open markprompt',
  model,
  overlayClassName,
  projectKey,
  promptClassName,
  title = 'Ask the robot a question.',
  triggerClassName,
  triggerIconClassName,
}: MarkpromptDialogProps): ReactElement {
  return (
    <Root>
      <Trigger
        aria-label={label}
        className={classNames('markprompt-trigger', triggerClassName)}
      >
        <MarkpromptIcon
          className={classNames(
            'markprompt-trigger-icon',
            triggerIconClassName,
          )}
        />
      </Trigger>
      <Portal>
        <Overlay
          className={classNames('markprompt-overlay', overlayClassName)}
        />
        <Content className={classNames('markprompt-content', contentClassName)}>
          <Close
            className={classNames(
              'markprompt-close-button',
              closeButtonClassName,
            )}
          >
            <Cross1Icon />
          </Close>

          {/* Markprompt.Title is included for accessibility reasons and can be hidden. */}
          <VisuallyHidden asChild>
            <Title>{title}</Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons and can be hidden. */}
          <VisuallyHidden asChild>
            <Description>{description}</Description>
          </VisuallyHidden>

          <Provider
            completionsUrl={completionsUrl}
            iDontKnowMessage={iDontKnowMessage}
            model={model}
            projectKey={projectKey}
          >
            <Form>
              <Prompt
                className={classNames('markprompt-prompt', promptClassName)}
                placeholder={description}
              />
            </Form>
            <Answer />
          </Provider>
        </Content>
      </Portal>
    </Root>
  );
}
