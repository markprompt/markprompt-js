import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('markprompt-chat-icon')
export class ChatIcon extends LitElement {
  static styles = css`
    svg {
      display: block;
      width: 1.25rem;
      height: 1.25rem;
    }
  `;

  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
      </svg>
    `;
  }
}

@customElement('markprompt-search-icon')
export class SearchIcon extends LitElement {
  static styles = css`
    svg {
      color: var(--markprompt-foreground);
      width: var(--markprompt-button-icon-size);
      height: var(--markprompt-button-icon-size);
    }
  `;

  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
      </svg>
    `;
  }
}

@customElement('markprompt-icon')
export class MarkpromptIcon extends LitElement {
  render() {
    return html`
      <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M111.165 23.39h97.67c19.989 0 34.814.003 46.55.961 11.705.957 20.093 2.851 27.254 6.499a68.442 68.442 0 0 1 29.91 29.911c3.65 7.161 5.543 15.55 6.499 27.254.96 11.736.962 26.561.962 46.55v50.87c0 19.989-.002 34.813-.962 46.55-.956 11.704-2.849 20.093-6.499 27.253a68.432 68.432 0 0 1-29.91 29.911c-7.161 3.649-15.549 5.543-27.254 6.499-11.736.96-26.561.962-46.55.962h-97.67c-19.989 0-34.814-.002-46.551-.962-11.704-.956-20.092-2.85-27.253-6.499A68.434 68.434 0 0 1 7.45 259.238c-3.649-7.16-5.543-15.549-6.499-27.253-.959-11.737-.961-26.561-.961-46.55v-50.87c0-19.989.002-34.814.961-46.55.956-11.704 2.85-20.093 6.499-27.254A68.445 68.445 0 0 1 37.361 30.85c7.161-3.648 15.549-5.542 27.253-6.499 11.737-.958 26.562-.961 46.551-.961Zm171.634 179.589c0-12.716-10.308-23.024-23.025-23.024-12.716 0-23.025 10.308-23.025 23.024 0 12.717 10.309 23.025 23.025 23.025 12.717 0 23.025-10.308 23.025-23.025Zm-42.212-97.855v47.969c0 5.297 4.295 9.593 9.593 9.593h19.188c5.299 0 9.594-4.296 9.594-9.593v-47.969a9.594 9.594 0 0 0-9.594-9.594H250.18c-5.298 0-9.593 4.295-9.593 9.594ZM50.631 226.004h19.187c5.299 0 9.594-4.295 9.594-9.593v-37.887c0-9.07 11.42-13.076 17.085-5.994l13.799 17.248c3.84 4.801 11.142 4.801 14.982 0l13.798-17.248c5.666-7.082 17.086-3.076 17.086 5.994v37.887c0 5.298 4.295 9.593 9.594 9.593h19.187c5.299 0 9.594-4.295 9.594-9.593V105.124a9.594 9.594 0 0 0-9.594-9.594h-24.171a9.589 9.589 0 0 0-7.49 3.601l-28.004 35.003c-3.84 4.801-11.142 4.801-14.982 0L82.292 99.131a9.59 9.59 0 0 0-7.491-3.601h-24.17a9.594 9.594 0 0 0-9.594 9.594v111.287c0 5.298 4.295 9.593 9.594 9.593Z"
          fill="currentColor"
        />
      </svg>
    `;
  }
}
