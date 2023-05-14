import { consume } from '@lit-labs/context';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { loadingState, type LoadingState } from './context.js';

@customElement('markprompt-animated-footer')
export class AnimatedFooter extends LitElement {
  static styles = css`
    div {
      position: relative;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      background-color: var(--markprompt-muted);
      border-top: 1px solid var(--markprompt-border);
      font-size: 0.75rem;
      transition: height 500ms ease;
      transform: translateY(100%);
      opacity: 0;
      animation: popup 200ms ease-out forwards;
      width: 100%;
      box-sizing: border-box;
    }

    div[data-markprompt-loading-state='indeterminate'] {
      display: none;
      height: 0;
    }

    div[data-markprompt-loading-state='preload'] {
      height: 50px;
    }

    div[data-markprompt-loading-state='streaming-answer'],
    div[data-markprompt-loading-state='done'] {
      height: 95px;
    }

    @keyframes popup {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  @consume({ context: loadingState, subscribe: true })
  loadingState: LoadingState = 'indeterminate';

  render() {
    return html`
      <div >
        <slot>
      </div>
    `;
  }
}
