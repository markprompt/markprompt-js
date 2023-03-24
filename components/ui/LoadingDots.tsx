import type { FC } from 'react';

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

export default LoadingDots;
