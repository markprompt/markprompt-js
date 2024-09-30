import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';

import { cn } from './utils.js';
import { CloseIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';
import { useMediaQuery } from '../useMediaQuery.js';

interface NavigationMenuProps {
  className?: string;
  title?: string;
  subtitle?: string;
  close: MarkpromptOptions['close'];
}

const NavigationMenu = ({
  className,
  title,
  subtitle,
  close,
}: NavigationMenuProps): JSX.Element => {
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  return (
    <div className={cn('MarkpromptNavigationMenu', className)}>
      <div className="MarkpromptNavigationMenuTitleContainer">
        <div className="MarkpromptNavigationMenuTitle">{title}</div>
        {subtitle && (
          <div className="MarkpromptNavigationMenuSubtitle">{subtitle}</div>
        )}
      </div>
      {close?.visible && (
        <div style={{ flexGrow: 0, marginRight: -4 }}>
          <BaseMarkprompt.Close
            className="MarkpromptClose"
            data-type={isTouchDevice || close?.hasIcon ? 'icon' : 'kbd'}
          >
            <AccessibleIcon.Root label={close?.label!}>
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
