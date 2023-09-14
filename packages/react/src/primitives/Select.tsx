import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSelect, type UseSelectProps } from 'downshift';
import React, { type ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T = Option> extends UseSelectProps<T> {
  className?: string;
  items: T[];
  itemToValue: (item: T) => string;
  itemToString: (item: T | null) => string;
  label?: string;
  toggle?: ReactNode;
  menuClassName?: string;
  toggleClassName?: string;
  itemClassName?: string;
}

export function Select<T = Option>(props: SelectProps<T>): JSX.Element {
  const {
    className,
    itemClassName,
    menuClassName,
    toggleClassName,
    label,
    items,
    toggle,
    itemToValue,
    itemToString,
    ...useSelectProps
  } = props;

  const {
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useSelect({
    items,
    itemToString,
    ...useSelectProps,
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className={className}>
      <div>
        <VisuallyHidden asChild>
          <label {...getLabelProps()}>{label}</label>
        </VisuallyHidden>
        <button
          type="button"
          className={toggleClassName}
          {...getToggleButtonProps({ ref: refs.setReference })}
        >
          {toggle}
        </button>
      </div>
      <ul
        className={menuClassName}
        style={floatingStyles}
        {...getMenuProps({ ref: refs.setFloating })}
      >
        {isOpen && (
          <FloatingPortal>
            {items.map((item, index) => (
              <li
                key={itemToValue(item)}
                className={itemClassName}
                data-highlighted={highlightedIndex === index}
                data-selected={selectedItem === item}
                {...getItemProps({ item, index })}
              >
                {itemToString(item)}
              </li>
            ))}
          </FloatingPortal>
        )}
      </ul>
    </div>
  );
}
