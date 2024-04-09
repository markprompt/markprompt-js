import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';

import { cn } from './utils.js';
import { CloseIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';

interface NavigationMenuProps {
  className?: string;
  title?: string;
  close: MarkpromptOptions['close'];
  isTouchDevice?: boolean;
}

const NavigationMenu = ({
  className,
  title,
  close,
  isTouchDevice,
}: NavigationMenuProps): JSX.Element => {
  return (
    <div className={cn('MarkpromptNavigationMenu', className)}>
      <div className="MarkpromptNavigationMenuTitle">{title}</div>
      {close?.visible && (
        <div style={{ flexGrow: 0, marginRight: -4 }}>
          <BaseMarkprompt.Close
            className="MarkpromptClose"
            data-type={isTouchDevice || close?.hasIcon ? 'icon' : 'kbd'}
          >
            <AccessibleIcon.Root label={close!.label!}>
              {isTouchDevice || close?.hasIcon ? (
                <CloseIcon strokeWidth={2} width={18} height={18} />
              ) : (
                <kbd>Esc</kbd>
              )}
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        </div>
      )}
    </div>
  );
};
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

export { NavigationMenu };
