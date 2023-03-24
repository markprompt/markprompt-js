import { FC, ReactNode } from 'react';

type ErrorLabelProps = {
  children?: ReactNode;
};

export const ErrorLabel: FC<ErrorLabelProps> = ({ children }) => {
  return <div className="mt-0.5 text-xs text-rose-600">{children}</div>;
};
