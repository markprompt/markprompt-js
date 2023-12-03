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
  shape?: 'rounded';
  light?: boolean;
  left?: boolean;
  href?: string;
  squareCorners?: 'right' | 'left';
  children?: ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  asLink?: boolean;
  asDropdown?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  noStyle?: boolean;
  noPadding?: boolean;
  Icon?: ElementType | string;
  Component?: ElementType | string;
} & React.HTMLProps<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      buttonSize,
      variant,
      shape,
      light,
      href,
      left,
      squareCorners,
      children,
      Icon,
      className,
      asLink,
      asDropdown,
      disabled,
      loading,
      loadingMessage,
      noStyle,
      noPadding,
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
        className={
          noStyle
            ? className
            : clsx(
                className,
                'button-ring relative flex select-none flex-row items-center whitespace-nowrap border disabled:cursor-not-allowed',
                {
                  'rounded-md': !squareCorners && shape !== 'rounded',
                  'rounded-l-md border-r-0':
                    squareCorners === 'right' && shape !== 'rounded',
                  'rounded-r-md':
                    squareCorners === 'left' && shape !== 'rounded',
                  'rounded-full': shape === 'rounded',
                  'justify-center': !left,
                  'justify-start': left,
                  'border-transparent bg-white text-neutral-900 hover:bg-neutral-300 disabled:bg-white/5 disabled:text-neutral-500 hover:disabled:bg-white/5 hover:disabled:bg-neutral-900':
                    variant === 'cta',
                  'button-glow-color border-transparent bg-fuchsia-600 text-white hover:bg-fuchsia-700':
                    variant === 'glow',
                  'border-transparent bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:bg-neutral-900 disabled:text-neutral-500 hover:disabled:bg-neutral-900':
                    variant === 'fuchsia',
                  'border-transparent bg-rose-800 text-white hover:bg-rose-900':
                    variant === 'danger',
                  'border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-1000 disabled:border-transparent disabled:text-neutral-500 hover:disabled:bg-opacity-100':
                    variant === 'plain',
                  'border-neutral-800 text-neutral-100 hover:bg-neutral-1000 disabled:border-transparent disabled:text-neutral-500 hover:disabled:bg-opacity-100':
                    variant === 'bordered' || variant === 'bordered-dashed',
                  'border-dashed': variant === 'bordered-dashed',
                  'button-ring-light border-neutral-900/10 text-neutral-900 hover:bg-neutral-100 disabled:opacity-50':
                    variant === 'borderedWhite',
                  'border-transparent text-neutral-100 hover:bg-neutral-1000 disabled:text-neutral-500 hover:disabled:bg-opacity-100':
                    variant === 'ghost',
                  'border-transparent text-neutral-100 disabled:text-neutral-500':
                    variant === 'text',
                  'border-fuchsia-400/20 text-fuchsia-400 hover:bg-fuchsia-900/20 hover:text-fuchsia-100 disabled:border-transparent disabled:text-fuchsia-500 hover:disabled:bg-opacity-100':
                    variant === 'borderedFuchsia',
                  'text-sm': size === 'base' || size === 'sm',
                  'text-xs': size === 'xs',
                  'text-sm sm:text-base': size === 'lg',
                  'px-4 py-2': size === 'base' && !noPadding,
                  'px-2 py-1.5': size === 'xs' && !noPadding,
                  'px-4 py-1.5': size === 'sm' && !noPadding,
                  'px-4 py-2.5 sm:px-5 sm:py-3': size === 'lg' && !noPadding,
                  'font-semibold': !light,
                },
              )
        }
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
