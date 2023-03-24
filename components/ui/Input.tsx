import cn from 'classnames';
import { FC, ReactNode } from 'react';

type InputProps = {
  inputSize?: 'sm' | 'base' | 'md' | 'lg';
  variant?: 'plain' | 'glow';
  children?: ReactNode;
  className?: string;
} & any;

export const NoAutoInput = (props: any) => {
  return (
    <Input
      {...props}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="on"
      spellCheck="false"
    />
  );
};

const Input: FC<InputProps> = ({
  inputSize: s,
  variant,
  children,
  className,
  ...props
}) => {
  let inputSize = s ?? 'base';
  return (
    <input
      {...props}
      className={cn(className, 'input-base', {
        'px-2 py-2 text-sm': inputSize === 'base',
        'px-2 py-1.5 text-sm': inputSize === 'sm',
        'input-glow-color': variant === 'glow',
      })}
    />
  );
};

export default Input;
