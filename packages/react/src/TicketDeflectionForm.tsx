import { NavigationMenu } from '@radix-ui/react-navigation-menu';

import type { MarkpromptOptions } from './types.js';

type TicketDeflectionFormProps = Pick<
  MarkpromptOptions,
  'display' | 'menu' | 'trigger' | 'linkAs' | 'children'
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function TicketDeflectionForm(props: TicketDeflectionFormProps): JSX.Element {
  // const { menu: menuConfig, linkAs, open, onOpenChange, children } = props;

  return (
    <div className="MarkpromptTicketDeflectionForm">
      {/* <NavigationMenu
        title={chat?.title}
        close={close}
        isTouchDevice={isTouchDevice}
      /> */}
    </div>
  );
}

export { TicketDeflectionForm };
