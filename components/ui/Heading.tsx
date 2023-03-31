// Adapted from: https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/layouts/ContentsLayout.js

import { useEffect, useContext, useRef } from 'react';
import { useTop } from '@/lib/hooks/utils/use-top';
import { MarkdocContext } from '../layouts/MarkdocLayout';
import cn from 'classnames';

export const Heading = ({
  level,
  id,
  children,
  number,
  badge,
  className = '',
  hidden = false,
  ignore = false,
  style = {},
  nextElement,
  ...props
}: any) => {
  const context = useContext(MarkdocContext);
  const Component = `h${level}`;
  const ref = useRef();
  const top = useTop(ref);

  useEffect(() => {
    if (typeof top !== 'undefined') {
      context.registerHeading(id, top, level);
    }

    return () => {
      context.unregisterHeading(id);
    };
    // Somehow it asks to add `context` as a dependency, causing
    // an infinite render look.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top, id, context.registerHeading, context.unregisterHeading]);

  return (
    <Component
      className={cn(
        className,
        'flow-row group flex items-center whitespace-pre-wrap',
        { '-ml-4 pl-4': !hidden },
      )}
      id={id}
      ref={ref}
      style={{ ...(hidden ? { marginBottom: 0 } : {}), ...style }}
      ignore-search={ignore ? '' : undefined}
      {...props}
    >
      {!hidden && (
        <a
          href={`#${id}`}
          className="not-prose absolute -ml-8 flex h-6 w-6 items-center justify-center border-b-0 no-underline opacity-0 group-hover:opacity-100"
          aria-label="Anchor"
        >
          <span className="text-neutral-600">#</span>
        </a>
      )}
      {number && (
        <span className="mr-3 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-neutral-100 text-xl text-neutral-700">
          {number}
        </span>
      )}
      <span className={hidden ? 'sr-only' : undefined}>{children}</span>
      {badge && (
        <span className="bg-green-150 ml-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-4 text-green-900">
          {badge}
        </span>
      )}
    </Component>
  );
};
