import { type ChatCompletionMessageToolCall } from '@markprompt/core';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import React, { useCallback, useMemo } from 'react';

import { type ChatViewTool, type ToolCall } from './store.js';
import {
  CheckCircleIcon,
  CircleDashedIcon,
  CrossCircleIcon,
  LoaderIcon,
} from '../icons.js';

interface DefaultToolCallsConfirmationProps {
  toolCalls: ChatCompletionMessageToolCall[];
  toolCallsStatus: { [key: string]: ToolCall };
  tools?: ChatViewTool[];
  confirmToolCalls: () => void;
}

export function DefaultToolCallsConfirmation(
  props: DefaultToolCallsConfirmationProps,
): JSX.Element {
  const { toolCalls, tools, toolCallsStatus, confirmToolCalls } = props;

  const toolCallsRequiringConfirmation = useMemo(() => {
    return toolCalls.filter((toolCall) => {
      const tool = tools?.find(
        (tool) => tool.tool.function.name === toolCall.function?.name,
      );

      return tool?.requireConfirmation ?? true;
    });
  }, [toolCalls, tools]);

  const toolCallsWithoutConfirmation = useMemo(() => {
    return toolCalls.filter((toolCall) => {
      const tool = tools?.find(
        (tool) => tool.tool.function.name === toolCall.function?.name,
      );

      return tool?.requireConfirmation === false;
    });
  }, [toolCalls, tools]);

  const getStatusIcon = useCallback((status?: ToolCall['status']) => {
    switch (status) {
      case 'loading':
        return LoaderIcon;
      case 'done':
        return CheckCircleIcon;
      case 'error':
        return CrossCircleIcon;
      default:
        return CircleDashedIcon;
    }
  }, []);

  const showConfirmButton = useMemo(() => {
    const validEntries = Object.entries(toolCallsStatus).filter(([key]) => {
      return toolCallsRequiringConfirmation.some(
        (toolCall) => toolCall.id === key,
      );
    });
    if (validEntries.length === 0) return true;
    return validEntries.some(([_key, value]) => value.status !== 'done');
  }, [toolCallsRequiringConfirmation, toolCallsStatus]);

  return (
    <div className="MarkpromptToolCallConfirmation">
      {toolCallsWithoutConfirmation.length > 0 && (
        <div>
          <p>The bot is calling the following tools on your behalf:</p>
          {toolCallsWithoutConfirmation.map((toolCall) => {
            const tool = tools?.find(
              (tool) => tool.tool.function.name === toolCall.function?.name,
            );

            if (!tool) throw Error('tool not found');

            return (
              <p key={toolCall.function.name}>
                <strong>
                  {tool.tool.function.description ?? tool.tool.function.name}
                </strong>
              </p>
            );
          })}
        </div>
      )}

      {toolCallsRequiringConfirmation.length > 0 && (
        <>
          <div>
            <p>
              The bot wants to perform the following{' '}
              {toolCalls.length === 1 ? 'action' : 'actions'}, please confirm
              that you allow to:
            </p>
            {toolCallsRequiringConfirmation.map((toolCall) => {
              const tool = tools?.find(
                (tool) => tool.tool.function.name === toolCall.function?.name,
              );

              if (!tool) throw Error('tool not found');

              const status = toolCallsStatus[toolCall.id]?.status;
              const StatusIcon = getStatusIcon(status);

              return (
                <p
                  key={toolCall.function.name}
                  className="MarkpromptToolDescriptionWithStatus"
                >
                  <AccessibleIcon
                    label={`Tool status: ${status ?? 'not started'}`}
                  >
                    <StatusIcon
                      width={16}
                      height={16}
                      className={`MarkpromptToolCallStatusIcon`}
                    />
                  </AccessibleIcon>
                  <strong>
                    {tool.tool.function.description ?? tool.tool.function.name}{' '}
                  </strong>
                </p>
              );
            })}
          </div>

          {showConfirmButton && (
            <div>
              <button className="MarkpromptButton" onClick={confirmToolCalls}>
                Confirm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
