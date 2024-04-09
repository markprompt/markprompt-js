import type { MarkpromptOptions } from './types.js';
import { NavigationMenu } from './ui/navigation-menu.js';

type TicketDeflectionFormProps = Pick<MarkpromptOptions, 'ticketForm'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function TicketDeflectionForm(props: TicketDeflectionFormProps): JSX.Element {
  const { ticketForm } = props;

  return (
    <div className="MarkpromptTicketDeflectionForm">
      <NavigationMenu
        title={ticketForm?.title}
        subtitle={ticketForm?.subtitle}
        close={{ visible: true, hasIcon: true }}
      />
    </div>
  );
}

export { TicketDeflectionForm };
