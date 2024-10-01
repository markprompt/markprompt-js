import type { ComponentPropsWithoutRef, ReactElement } from 'react';

const ChatIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M18.111 1.002a.815.815 0 0 1 .79.617l.28 1.125a2.86 2.86 0 0 0 2.075 2.074l1.125.28a.814.814 0 0 1 0 1.582l-1.125.28a2.86 2.86 0 0 0-2.074 2.074l-.28 1.125a.815.815 0 0 1-1.582 0l-.28-1.125a2.85 2.85 0 0 0-2.074-2.074l-1.125-.28a.814.814 0 0 1 0-1.582l1.125-.28a2.85 2.85 0 0 0 2.074-2.074l.28-1.125a.815.815 0 0 1 .791-.617"
      clipRule="evenodd"
      style={{
        fillOpacity: 0.6,
      }}
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.713 3.99a9 9 0 0 0-.626-.02c-4.697 0-8.606 3.503-8.606 7.943 0 2.127.904 4.049 2.36 5.465.205.2.245.378.225.48a3.3 3.3 0 0 1-.719 1.488.662.662 0 0 0 .389 1.079q.234.042.47.065a5.93 5.93 0 0 0 3.748-.88c.683.161 1.398.247 2.133.247 4.697 0 8.606-3.504 8.606-7.944 0-.63-.08-1.24-.228-1.826l-.107.433v.001a2.317 2.317 0 0 1-3.673 1.265 2.3 2.3 0 0 1-.82-1.265l-.28-1.123a1.35 1.35 0 0 0-.983-.983l-1.122-.28h-.001a2.314 2.314 0 0 1-.766-4.145"
      clipRule="evenodd"
    />
  </svg>
);

const ChatIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
    />
  </svg>
);

const BookIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const CloseIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ChevronLeftIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronDownIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const ChevronRightIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

const SearchIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const SearchIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const ClipboardIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const SendIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" opacity=".25" />
    <path d="M8 12h8" />
    <path d="m12 16 4-4-4-4" />
  </svg>
);

const SparklesIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
      clipRule="evenodd"
    />
  </svg>
);

const CornerDownLeftIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 10 4 15 9 20" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </svg>
);

const CommandIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
  </svg>
);

const CounterClockwiseClockIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const ChevronUpIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const FileTextIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const HashIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" x2="20" y1="9" y2="9" />
    <line x1="4" x2="20" y1="15" y2="15" />
    <line x1="10" x2="8" y1="3" y2="21" />
    <line x1="16" x2="14" y1="3" y2="21" />
  </svg>
);

const ThumbsUpIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const ThumbsDownIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
);

const ReloadIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    stroke="currentColor"
    fill="none"
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const StopIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    stroke="currentColor"
    fill="none"
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <rect width="6" height="6" x="9" y="9" />
  </svg>
);

const PlusIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const CheckIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoaderIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CheckCircleIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CrossCircleIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const CircleDashedIcon = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
    <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
    <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
    <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
    <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
    <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
    <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
    <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
  </svg>
);

const UserIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

const LoadingIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="12" r="10" opacity=".25" stroke="currentColor" />
    <path
      fill="currentColor"
      d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
    >
      <animateTransform
        attributeName="transform"
        dur="1s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </path>
  </svg>
);

const NewspaperIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
    />
  </svg>
);

const SparklesIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

const MenuIconOutline = (
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
    />
  </svg>
);

const DiscordIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M13.545 2.913a13.196 13.196 0 0 0-3.257-1.01.05.05 0 0 0-.052.025 9.18 9.18 0 0 0-.406.833 12.18 12.18 0 0 0-3.658 0 8.426 8.426 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.01a.047.047 0 0 0-.021.019C.356 6.03-.213 9.053.066 12.039a.055.055 0 0 0 .02.037 13.266 13.266 0 0 0 3.996 2.02.052.052 0 0 0 .056-.019c.308-.42.582-.863.818-1.33a.05.05 0 0 0-.028-.07 8.735 8.735 0 0 1-1.248-.595.05.05 0 0 1-.025-.04.052.052 0 0 1 .02-.045 6.8 6.8 0 0 0 .248-.194.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.006c.08.066.164.132.248.195a.05.05 0 0 1 .02.044.051.051 0 0 1-.024.041 8.19 8.19 0 0 1-1.249.595.052.052 0 0 0-.03.029.05.05 0 0 0 .003.042c.24.465.514.908.817 1.329a.05.05 0 0 0 .056.019 13.225 13.225 0 0 0 4.001-2.02.052.052 0 0 0 .021-.037c.334-3.451-.559-6.45-2.365-9.107a.04.04 0 0 0-.021-.019Zm-8.198 7.308c-.789 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .889-.637 1.613-1.438 1.613Zm5.316 0c-.788 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .889-.63 1.613-1.438 1.613Z"
    />
  </svg>
);

const StarIcon = (props: ComponentPropsWithoutRef<'svg'>): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: label provided elsewhere
  <svg viewBox="0 0 24 24" {...props} strokeWidth="1.5" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

export {
  BookIconOutline,
  ChatIcon,
  ChatIconOutline,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleDashedIcon,
  ClipboardIcon,
  CloseIcon,
  CommandIcon,
  CornerDownLeftIcon,
  CounterClockwiseClockIcon,
  CrossCircleIcon,
  DiscordIcon,
  FileTextIcon,
  HashIcon,
  LoaderIcon,
  LoadingIcon,
  MenuIconOutline,
  NewspaperIconOutline,
  PlusIcon,
  ReloadIcon,
  SearchIcon,
  SearchIconOutline,
  SendIcon,
  SparklesIcon,
  SparklesIconOutline,
  StarIcon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
};
