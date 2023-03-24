import cn from 'classnames';
import { FC, ReactNode } from 'react';

type ToggleMessageProps = {
  message1: ReactNode;
  message2: ReactNode;
  showMessage1: boolean;
};

export const ToggleMessage: FC<ToggleMessageProps> = ({
  message1,
  message2,
  showMessage1,
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <p
        className={cn(
          'pointer-events-none transform text-center transition duration-500',
          {
            'translate-y-0 opacity-100': showMessage1,
            '-translate-y-1 opacity-0': !showMessage1,
          },
        )}
      >
        {message1}
      </p>
      <p
        className={cn(
          'pointer-events-none absolute inset-x-4 transform whitespace-nowrap text-center transition duration-500',
          {
            'translate-y-0 opacity-100': !showMessage1,
            '-translate-y-1 opacity-0': showMessage1,
          },
        )}
      >
        {message2}
      </p>
    </div>
  );
};
