import { useEffect } from 'react';

import { ChatView } from './chat/ChatView.js';
import { useChatStore } from './chat/store.js';
import type { MarkpromptOptions } from './types.js';
import { NavigationMenu } from './ui/navigation-menu.js';
import { RichText } from './ui/rich-text.js';

type TicketDeflectionFormProps = Pick<
  MarkpromptOptions,
  'chat' | 'ticketForm' | 'branding' | 'feedback' | 'references'
> & {
  projectKey: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function TicketDeflectionForm(props: TicketDeflectionFormProps): JSX.Element {
  const { projectKey, chat, ticketForm, feedback, references } = props;

  const selectConversation = useChatStore((state) => state.selectConversation);

  useEffect(() => {
    // Clear past conversations
    selectConversation(undefined);
  }, [selectConversation]);

  return (
    <div className="MarkpromptTicketDeflectionForm">
      <NavigationMenu
        title={ticketForm?.title}
        subtitle={ticketForm?.subtitle}
        close={{ visible: true, hasIcon: true }}
      />
      <ChatView
        activeView="chat"
        chatOptions={{
          ...chat,
          history: false,
          placeholder: ticketForm?.placeholder,
          defaultView: undefined,
          buttonLabel: ticketForm?.buttonLabel,
        }}
        feedbackOptions={feedback}
        projectKey={projectKey}
        referencesOptions={references}
        branding={{ show: false }}
        submitOnEnter={false}
        minInputRows={10}
      />
      <div className="MarkpromptDialogFooter">
        <RichText>{ticketForm?.disclaimerView?.message || ''}</RichText>
        {
          <button className="MarkpromptButton" data-variant="outline">
            Create Case
            {/* {buttonLabel}
            {Icon} */}
          </button>
        }
      </div>
    </div>
  );
}

export { TicketDeflectionForm };
