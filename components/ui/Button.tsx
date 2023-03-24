import cn from 'classnames';
import Link from 'next/link';
import { forwardRef, JSXElementConstructor, ReactNode, useRef } from 'react';
import LoadingDots from './LoadingDots';

export type ButtonVariant =
  | 'cta'
  | 'glow'
  | 'danger'
  | 'ghost'
  | 'plain'
  | 'fuchsia';

type ButtonProps = {
  buttonSize?: 'sm' | 'base' | 'md' | 'lg';
  variant?: ButtonVariant;
  href?: string;
  Icon?: JSXElementConstructor<any> | string;
  children?: ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  asLink?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  Component?: JSXElementConstructor<any> | string;
} & React.HTMLProps<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      buttonSize,
      variant,
      href,
      children,
      Icon,
      className,
      asLink,
      disabled,
      loading,
      loadingMessage,
      Component = 'button',
      ...props
    },
    ref,
  ) => {
    const Comp: any = asLink ? Link : href ? 'a' : Component;

    let size = buttonSize ?? 'base';
    return (
      <Comp
        {...(!asLink ? { ref } : {})}
        {...(!asLink ? { disabled } : {})}
        {...props}
        disabled={disabled || loading}
        className={cn(
          className,
          'relative flex select-none flex-row items-center justify-center gap-3 whitespace-nowrap rounded-md border font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed',
          {
            'border-transparent bg-white text-neutral-900 hover:bg-neutral-300 disabled:bg-neutral-900 disabled:text-neutral-500 hover:disabled:bg-neutral-900':
              variant === 'cta',
            'button-glow-color border-transparent bg-fuchsia-600 text-white hover:bg-fuchsia-700':
              variant === 'glow',
            'border-transparent bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:bg-neutral-900 disabled:text-neutral-500 hover:disabled:bg-neutral-900':
              variant === 'fuchsia',
            'border-transparent bg-rose-800 text-white hover:bg-rose-900':
              variant === 'danger',
            'border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-1000 disabled:border-transparent disabled:text-neutral-500 hover:disabled:bg-opacity-100':
              variant === 'plain',
            'px-4 py-2 text-sm': size === 'base',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-3 text-base': size === 'lg',
          },
        )}
        {...(href ? { href } : {})}
      >
        {Icon && <Icon className={cn('h-5 w-5')} />}
        <span
          className={cn('absolute inset-0 flex items-center justify-center', {
            'pointer-events-none opacity-0': !loading,
            'animate-pulse opacity-100': loading && loadingMessage,
          })}
        >
          {loadingMessage}
        </span>
        {loading && !loadingMessage && (
          <i className="absolute left-0 right-0 top-0 bottom-0 flex justify-center">
            <LoadingDots
              className={cn({
                'bg-neutral-500': variant === 'cta',
                'bg-white/70': variant !== 'cta',
              })}
            />
          </i>
        )}
        <div
          className={cn('truncate', {
            'opacity-0': loading,
            'opacity-100': !loading,
          })}
        >
          {children}
        </div>
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export default Button;
