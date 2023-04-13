import { FC, ReactNode } from 'react';

type MDXComponentProps = {
  children: ReactNode;
};

export const MDXComponent: FC<MDXComponentProps> = ({ children }) => {
  return (
    <div className="prose mx-auto max-w-screen-md p-8 dark:prose-invert">
      {children}
    </div>
  );
};
