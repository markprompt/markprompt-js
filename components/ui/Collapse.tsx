import * as Accordion from '@radix-ui/react-accordion';
import React, { FC, forwardRef, ReactNode } from 'react';
import cn from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';

type CollapseGroupProps = {
  children: ReactNode;
};

export const CollapseGroup: FC<CollapseGroupProps> = ({ children }) => (
  <Accordion.Root
    className="not-prose w-full rounded-md"
    type="single"
    collapsible
  >
    {children}
  </Accordion.Root>
);

type CollapseProps = {
  title: string;
  children: ReactNode;
};

export const Collapse: FC<CollapseProps> = ({ title, children }) => {
  return (
    <Accordion.Item
      className="overflow-hidden border-b first:rounded-tl-md first:rounded-tr-md first:border-neutral-800 last:rounded-bl-md last:rounded-br-md last:border-none"
      value={title}
    >
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </Accordion.Item>
  );
};

const AccordionTrigger = forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Header className="flex w-full">
      <Accordion.Trigger
        className={cn(
          'collapse-trigger flex w-full flex-row items-center gap-4 py-3 text-base outline-none transition hover:opacity-80',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <div className="flex-grow truncate text-left text-neutral-300">
          {children}
        </div>
        <ChevronDownIcon
          className="collapse-chevron h-5 w-5 flex-none -rotate-90 text-neutral-500 transition duration-300"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Content
      className={cn(
        'prose max-w-full overflow-hidden text-base leading-relaxed text-neutral-400',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-4">{children}</div>
    </Accordion.Content>
  ),
);

AccordionContent.displayName = 'AccordionContent';
