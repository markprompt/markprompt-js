/* eslint-disable react/jsx-no-target-blank */
import React, { type ComponentPropsWithoutRef, type ReactElement } from 'react';

export const Footer = (): ReactElement => {
  return (
    <p
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        justifyContent: 'center',
        margin: 0,
        padding: '.375rem 0.75rem',
        backgroundColor: 'var(--markprompt-muted)',
        color: 'var(--markprompt-mutedForeground)',
        borderTop: '1px solid var(--markprompt-border)',
        fontSize: '0.75rem',
        fontWeight: 500,
        zIndex: 1,
      }}
    >
      Powered by{' '}
      <a
        style={{
          color: 'var(--markprompt-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          textDecoration: 'none',
        }}
        target="_blank"
        href="https://markprompt.com"
      >
        <MarkpromptIcon style={{ width: '16px', height: '16px' }} aria-hidden />
        Markprompt AI
      </a>
    </p>
  );
};

Footer.displayName = 'Markprompt.Footer';

export const MarkpromptIcon = ({
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<'svg'>): ReactElement => {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M111.165 23.39h97.67c19.989 0 34.814.003 46.55.961 11.705.957 20.093 2.851 27.254 6.499a68.442 68.442 0 0 1 29.91 29.911c3.65 7.161 5.543 15.55 6.499 27.254.96 11.736.962 26.561.962 46.55v50.87c0 19.989-.002 34.813-.962 46.55-.956 11.704-2.849 20.093-6.499 27.253a68.432 68.432 0 0 1-29.91 29.911c-7.161 3.649-15.549 5.543-27.254 6.499-11.736.96-26.561.962-46.55.962h-97.67c-19.989 0-34.814-.002-46.551-.962-11.704-.956-20.092-2.85-27.253-6.499A68.434 68.434 0 0 1 7.45 259.238c-3.649-7.16-5.543-15.549-6.499-27.253-.959-11.737-.961-26.561-.961-46.55v-50.87c0-19.989.002-34.814.961-46.55.956-11.704 2.85-20.093 6.499-27.254A68.445 68.445 0 0 1 37.361 30.85c7.161-3.648 15.549-5.542 27.253-6.499 11.737-.958 26.562-.961 46.551-.961Zm171.634 179.589c0-12.716-10.308-23.024-23.025-23.024-12.716 0-23.025 10.308-23.025 23.024 0 12.717 10.309 23.025 23.025 23.025 12.717 0 23.025-10.308 23.025-23.025Zm-42.212-97.855v47.969c0 5.297 4.295 9.593 9.593 9.593h19.188c5.299 0 9.594-4.296 9.594-9.593v-47.969a9.594 9.594 0 0 0-9.594-9.594H250.18c-5.298 0-9.593 4.295-9.593 9.594ZM50.631 226.004h19.187c5.299 0 9.594-4.295 9.594-9.593v-37.887c0-9.07 11.42-13.076 17.085-5.994l13.799 17.248c3.84 4.801 11.142 4.801 14.982 0l13.798-17.248c5.666-7.082 17.086-3.076 17.086 5.994v37.887c0 5.298 4.295 9.593 9.594 9.593h19.187c5.299 0 9.594-4.295 9.594-9.593V105.124a9.594 9.594 0 0 0-9.594-9.594h-24.171a9.589 9.589 0 0 0-7.49 3.601l-28.004 35.003c-3.84 4.801-11.142 4.801-14.982 0L82.292 99.131a9.59 9.59 0 0 0-7.491-3.601h-24.17a9.594 9.594 0 0 0-9.594 9.594v111.287c0 5.298 4.295 9.593 9.594 9.593Z"
        fill="currentColor"
      />
    </svg>
  );
};
