import { FC, PropsWithChildren, ReactNode } from 'react';

export const CTABar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-row justify-end gap-2 border-t border-neutral-900 p-4">
      {children}
    </div>
  );
};

export const DescriptionLabel: FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-4 text-sm text-neutral-500">{children}</div>;
};

type SettingsCardProps = {
  title: string | ReactNode;
  description?: string;
  children?: ReactNode;
};

export const SettingsCard: FC<SettingsCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-900 bg-neutral-1000">
      <div className="flex flex-col gap-2 border-b border-neutral-900 p-4">
        <h2 className="text-base font-bold text-neutral-100">{title}</h2>
        {description && (
          <h3 className="text-sm text-neutral-500">{description}</h3>
        )}
      </div>
      {children}
    </div>
  );
};
