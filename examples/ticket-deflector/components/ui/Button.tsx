import { clsx } from 'clsx';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import type { ElementType, FC } from 'react';

type LoadingDotsProps = {
  className?: string;
};

const LoadingDots: FC<LoadingDotsProps> = ({ className }) => {
  return (
    <span className="loading-dots">
      <span className={className} />
      <span className={className} />
      <span className={className} />
    </span>
  );
};

export type ButtonVariant =
  | 'cta'
  | 'glow'
  | 'danger'
  | 'ghost'
  | 'text'
  | 'plain'
  | 'bordered'
  | 'bordered-dashed'
  | 'fuchsia'
  | 'borderedWhite'
  | 'borderedFuchsia';

export const ButtonOrLinkWrapper = forwardRef(
  (
    { href, className, children, Component = 'button', ...props }: ButtonProps,
    forwardedRef,
  ) => {
    const Comp = href ? 'a' : Component;

    return (
      <Comp
        ref={forwardedRef}
        className={className}
        {...props}
        {...(href ? { href } : {})}
      >
        {children}
      </Comp>
    );
  },
);

ButtonOrLinkWrapper.displayName = 'ButtonOrLinkWrapper';

export type ButtonProps = {
  buttonSize?: 'xs' | 'sm' | 'base' | 'md' | 'lg';
  variant?: ButtonVariant;
  href?: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  asLink?: boolean;
  asDropdown?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  Icon?: ElementType | string;
  Component?: ElementType | string;
} & React.HTMLProps<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      buttonSize,
      variant,
      href,
      children,
      Icon,
      className,
      asLink,
      asDropdown,
      disabled,
      loading,
      loadingMessage,
      Component = 'button',
      ...props
    },
    ref,
  ) => {
    const Comp = asLink ? Link : href ? 'a' : Component;
    const size = buttonSize ?? 'base';

    return (
      <Comp
        {...(!asLink ? { ref } : {})}
        {...(!asLink ? { disabled } : {})}
        {...props}
        // @ts-expect-error - disabled does not exist on Link, ignore
        disabled={disabled || loading}
        className={clsx(
          className,
          'outline-none relative flex select-none flex-row items-center whitespace-nowrap disabled:cursor-not-allowed rounded-md font-medium transition',
          {
            'border border-transparent bg-black text-white hover:bg-black/70 disabled:bg-neutral-300':
              variant === 'cta',
            'border border-neutral-200 text-neutral-900 hover:bg-neutral-100 disabled:border-transparent disabled:text-neutral-500':
              variant === 'plain',
            'px-4 py-1 text-sm': size === 'base',
          },
        )}
        {...(href ? { href } : {})}
      >
        {Icon && <Icon className="-ml-0.5 mr-2 h-4 w-4" />}
        <span
          className={clsx('absolute inset-0 flex items-center justify-center', {
            'pointer-events-none opacity-0': !loading,
            'animate-pulse opacity-100': loading && loadingMessage,
          })}
        >
          {loadingMessage}
        </span>
        {loading && !loadingMessage && (
          <i className="absolute left-0 right-0 top-0 bottom-0 flex justify-center">
            <LoadingDots
              className={clsx({
                'bg-neutral-500': variant === 'cta',
                'bg-white/70': variant !== 'cta',
              })}
            />
          </i>
        )}
        <div
          className={clsx('truncate', {
            'opacity-0': loading,
            'opacity-100': !loading,
          })}
        >
          {children}
        </div>
        {asDropdown && (
          <ChevronDownIcon className="-mr-0.5 ml-2 h-4 w-4 text-neutral-500" />
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
