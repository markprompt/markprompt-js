import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Button } from './Button';

export const Dropdown = ({
  selected,
  options,
  className,
}: {
  selected: number;
  options: string[];
  className: string;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={className} variant="plain">
          {options[selected]}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          {options.map((o, i) => {
            return (
              <DropdownMenu.Item
                className="DropdownMenuItem"
                key={`option-${i}`}
              >
                {o}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
