import { FC, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Button, { ButtonVariant } from '../ui/Button';
// import { AppState } from '@/types/types';
import { CTABar } from '../ui/SettingsCard';

type ConfirmDialogProps = {
  cta: string;
  title: string;
  description?: string;
  variant?: ButtonVariant;
  loading?: boolean;
  onCTAClick: () => Promise<void>;
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  cta,
  title,
  description,
  variant,
  loading,
  onCTAClick,
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="animate-overlay-appear dialog-overlay" />
      <Dialog.Content className="animate-dialog-slide-in dialog-content max-h-min min-w-[360px] max-w-min">
        <Dialog.Title className="dialog-title">{title}</Dialog.Title>
        <Dialog.Description className="dialog-description mb-6">
          {description}
        </Dialog.Description>
        <CTABar>
          <Dialog.Close asChild>
            <Button variant="plain" buttonSize="sm">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            loading={!!loading}
            variant={variant}
            onClick={onCTAClick}
            buttonSize="sm"
          >
            {cta}
          </Button>
        </CTABar>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default ConfirmDialog;
