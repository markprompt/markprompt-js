/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ReactSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import React, { forwardRef } from 'react';

import { Button } from './Button';

export const Select = ({
  selected,
  options,
  className,
}: {
  selected: number;
  options: string[];
  className: string;
}) => {
  return (
    <ReactSelect.Root>
      <ReactSelect.Trigger className="SelectTrigger" aria-label="Food">
        <ReactSelect.Value placeholder="Select a fruit…" />
        <ReactSelect.Icon className="SelectIcon">
          {/* <Button className={className} variant="plain">
            {options[selected] || ''}
          </Button> */}
        </ReactSelect.Icon>
      </ReactSelect.Trigger>
      <ReactSelect.Portal>
        <ReactSelect.Content className="SelectContent">
          <ReactSelect.Group>
            {options.map((o, i) => {
              return (
                <SelectItem key={`select-${i}`} value={o}>
                  {o}
                </SelectItem>
              );
            })}
          </ReactSelect.Group>
        </ReactSelect.Content>
      </ReactSelect.Portal>
    </ReactSelect.Root>
  );
};

const SelectItem = forwardRef(
  ({ children, className, ...props }: any, forwardedRef: any) => {
    return (
      <ReactSelect.Item
        className={clsx('SelectItem', className)}
        {...props}
        ref={forwardedRef}
      >
        <ReactSelect.ItemText>{children}</ReactSelect.ItemText>
        <ReactSelect.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </ReactSelect.ItemIndicator>
      </ReactSelect.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';
