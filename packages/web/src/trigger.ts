import { consume } from '@lit-labs/context';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { open } from './context.js';
import type { OpenEvent } from './types.js';

@customElement('markprompt-trigger')
export class Trigger extends LitElement {
  static styles = css`
    button {
      display: flex;
      cursor: pointer;
      border: none;
      border-radius: 99999px;
      color: var(--markprompt-primaryForeground);
      background-color: var(--markprompt-primary);
      padding: 0.75rem;
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      transition-property: opacity;
      transition-duration: 200ms;
      outline: none;
    }

    button:hover {
      opacity: 0.8;
    }
  `;

  @consume({ context: open, subscribe: true })
  open!: boolean;

  handleClick() {
    this.dispatchEvent(
      new CustomEvent('open', {
        composed: true,
        bubbles: true,
        detail: {
          open: !this.open,
        },
      }) satisfies OpenEvent,
    );
  }

  render() {
    return html`
      <button @click="${this.handleClick}" aria-label="open">
      <markprompt-chat-icon>
      </button>
    `;
  }
}
