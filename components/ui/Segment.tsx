import cn from 'classnames';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

type SegmentProps = {
  id: string;
  selected: number;
  items: (string | ReactNode)[];
  variant?: 'text' | 'toggle';
  size?: 'xs' | 'sm' | 'base';
  onChange: (selected: number) => void;
};

export const Segment: FC<SegmentProps> = ({
  id,
  selected,
  items,
  variant = 'toggle',
  size = 'base',
  onChange,
}) => {
  const [pos, setPos] = useState({ left: 0, width: 0 });
  const [hasInteractedOnce, setHasInteractedOnce] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function setTabPosition() {
      const currentTab = buttonRefs.current[selected];
      setPos({
        left: currentTab?.offsetLeft ?? 0,
        width: currentTab?.clientWidth ?? 0,
      });
    }

    setTabPosition();

    window.addEventListener('resize', setTabPosition);

    return () => window.removeEventListener('resize', setTabPosition);
  }, [selected]);

  return (
    <div
      className={cn('relative flex flex-row rounded-full', {
        'border border-neutral-900 bg-neutral-1000 p-0.5': variant === 'toggle',
        'gap-2': variant === 'text',
      })}
    >
      {items.map((item, i) => {
        return (
          <button
            ref={(el) => (buttonRefs.current[i] = el)}
            className={cn(
              'z-10 appearance-none font-medium outline-none transition duration-500 focus:outline-none',
              {
                'text-white': selected === i,
                'text-neutral-500 hover:text-white': selected !== i,
                'text-sm': size === 'base',
                'text-xs': size === 'sm' || size === 'xs',
                'px-4 py-1': size === 'base' && variant === 'toggle',
                'px-3 py-0.5': size === 'sm' && variant === 'toggle',
                'px-1 py-0.5': size === 'xs' && variant === 'toggle',
                'rounded-full ': variant === 'toggle',
                'border-b border-transparent': variant === 'text',
                'subtle-underline': selected === i && variant === 'text',
              },
            )}
            onClick={(e) => {
              setHasInteractedOnce(true);
              onChange(i);
            }}
            key={`segment-${id}-${i}`}
          >
            {item}
          </button>
        );
      })}
      {variant === 'toggle' && (
        <div
          className={cn(
            'absolute top-0.5 bottom-0.5 z-0 transform rounded-full bg-fuchsia-600',
            {
              'transition-all duration-300 ease-in-out': hasInteractedOnce,
            },
          )}
          style={{
            left: pos.left,
            width: pos.width,
          }}
        />
      )}
    </div>
  );
};
