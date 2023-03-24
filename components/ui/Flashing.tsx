import cn from 'classnames';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactNode,
  useState,
} from 'react';

type FlashingProps = {
  active: number;
  children: ReactNode;
};

export const Flashing: FC<FlashingProps> = ({ active, children }) => {
  return (
    <div className="pointer-events-none relative flex w-full items-center justify-center">
      {Children.map(children, (child, i) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              'transition duration-500 transform-all',
              {
                // Let the first child dictate the size. Subsequent children
                // get absolute positioning
                'absolute inset-x': i > 0,
                'opacity-100 delay-300': i === active,
                'opacity-0': i !== active,
              },
            ),
          });
        }
        return child;
      })}
    </div>
  );
};
