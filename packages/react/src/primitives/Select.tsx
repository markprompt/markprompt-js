import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { useSelect, type UseSelectProps } from 'downshift';
import { useMemo, type ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface OptGroup<T extends Option> {
  label: string;
  items: T[];
}

interface SelectProps<T extends Option>
  extends Omit<UseSelectProps<T>, 'items'> {
  className?: string;
  disabled?: boolean;
  hasLabel?: boolean;
  itemClassName?: string;
  items: (OptGroup<T> | T)[];
  itemToChildren?: (item: T | null) => ReactNode;
  itemToString: (item: T | null) => string;
  label?: ReactNode;
  menuClassName?: string;
  toggle?: ReactNode;
  toggleClassName?: string;
}

export function Select<T extends Option>(props: SelectProps<T>): JSX.Element {
  const {
    className,
    itemClassName,
    menuClassName,
    toggleClassName,
    label,
    items,
    toggle,
    itemToChildren,
    itemToString,
    disabled,
    hasLabel,
    ...useSelectProps
  } = props;

  const flatItems = useMemo(
    () => items.flatMap((x) => ('items' in x ? x.items : [x])),
    [items],
  );

  const {
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useSelect({
    items: flatItems,
    itemToString,
    ...useSelectProps,
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'top-start',
  });

  const labelEl = <label {...getLabelProps()}>{label}</label>;

  return (
    <div className={clsx('MarkpromptSelect', className)}>
      {hasLabel ? labelEl : <VisuallyHidden asChild>{labelEl}</VisuallyHidden>}

      <button
        type="button"
        className={clsx('MarkpromptSelectToggle', toggleClassName)}
        {...getToggleButtonProps({ ref: refs.setReference })}
        disabled={disabled}
      >
        {toggle}
      </button>

      <ul
        className={clsx('MarkpromptSelectMenu', menuClassName)}
        style={floatingStyles}
        data-open={isOpen}
        {...getMenuProps({ ref: refs.setFloating })}
      >
        {isOpen &&
          items.map((itemOrGroup, index) =>
            'items' in itemOrGroup ? (
              <li key={itemOrGroup.label}>
                <b>{itemOrGroup.label}</b>
                <ul>
                  {itemOrGroup.items.map((item) => (
                    <li
                      key={itemToString(item)}
                      className={itemClassName}
                      data-highlighted={highlightedIndex === index}
                      data-selected={
                        itemToString(selectedItem) === itemToString(item)
                      }
                      {...getItemProps({ item, index })}
                    >
                      {itemToChildren
                        ? itemToChildren(item)
                        : itemToString(item)}
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li
                key={`${itemToString(itemOrGroup)}`}
                // itemIndex={flatItems.findIndex(
                //   (x) => itemToString(x) === itemToString(itemOrGroup),
                // )}
                className={itemClassName}
                data-highlighted={
                  highlightedIndex ===
                  flatItems.findIndex(
                    (x) => itemToString(x) === itemToString(itemOrGroup),
                  )
                }
                data-selected={
                  itemToString(selectedItem) === itemToString(itemOrGroup)
                }
                {...getItemProps({
                  item: itemOrGroup,
                  index: flatItems.findIndex(
                    (x) => itemToString(x) === itemToString(itemOrGroup),
                  ),
                })}
              >
                {itemToChildren
                  ? itemToChildren(itemOrGroup)
                  : itemToString(itemOrGroup)}
              </li>
            ),
          )}
      </ul>
    </div>
  );
}

// export interface OptionsProps<T extends Option> {
//   items: T[];
//   itemClassName?: string;
//   itemIndex: number;
//   highlightedIndex: number;
//   itemToString: (item: T) => string;
//   selectedItem: T;
//   itemToChildren?: (item: T | null) => ReactNode;
//   getItemProps: UseSelectReturnValue<T>['getItemProps'];
// }

// function Options<T extends Option>(props: OptionsProps<T>) {
//   const {
//     items,
//     itemIndex,
//     itemClassName,
//     highlightedIndex,
//     itemToString,
//     selectedItem,
//     itemToChildren,
//     getItemProps,
//   } = props;

//   return items.map((item) => (
//     <li
//       key={`${itemToString(item)}-${itemIndex}`}
//       className={itemClassName}
//       data-highlighted={highlightedIndex === itemIndex}
//       data-selected={itemToString(selectedItem) === itemToString(item)}
//       {...getItemProps({ item, index: itemIndex })}
//     >
//       {itemToChildren ? itemToChildren(item) : itemToString(item)}
//     </li>
//   ));
// }
