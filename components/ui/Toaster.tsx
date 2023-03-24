import { ToastBar, Toaster as ReactHotToaster } from 'react-hot-toast';

export const Toaster = () => (
  <ReactHotToaster
    toastOptions={{
      className: 'toast',
      success: { icon: null },
      error: { icon: null },
    }}
    position="bottom-center"
  >
    {(t) => (
      <ToastBar
        toast={t}
        style={{
          ...t.style,
          animation: t.visible
            ? 'toast-enter 0.2s ease-out'
            : 'toast-exit 0.4s ease-in forwards',
        }}
      />
    )}
  </ReactHotToaster>
);
