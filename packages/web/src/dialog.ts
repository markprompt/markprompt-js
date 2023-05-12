import { consume } from '@lit-labs/context';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';

import { open } from './context.js';
import type { OpenEvent } from './types.js';

@customElement('markprompt-dialog')
export class Dialog extends LitElement {
  static styles = css`
    .markprompt-dialog {
      margin: auto;
      padding: 0;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      background-color: var(--markprompt-background);
      background-color: var(--markprompt-background);
      border-radius: var(--markprompt-radius);
      border: 1px solid var(--markprompt-border);
      box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
        hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
      width: 80vw;
      max-width: 37.5rem;
      height: calc(100vh - 12.5rem);
      max-height: 37.5rem;
      animation-name: content-show;
      animation-duration: 300ms;
      animation-fill-mode: both;
      animation-repeat-count: 1;
      transition-timing-function: cubic-bezier(0.25, 0.4, 0.55, 1.4);
      color: var(--markprompt-foreground);
      overflow: hidden;
      display: none;
      grid-template-rows: auto 1fr auto;
    }

    .markprompt-dialog[open] {
      display: grid;
    }

    .markprompt-dialog::backdrop {
      position: fixed;
      inset: 0;
      background-color: var(--markprompt-overlay);
      animation: overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1) 1 forwards
        running;
    }

    @keyframes overlay-show {
      from {
        opacity: 0;
        backdrop-filter: blur(0);
      }
      to {
        opacity: 1;
        backdrop-filter: blur(0.25rem);
      }
    }

    @keyframes content-show {
      from {
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.98);
      }
      50% {
        transform: translate(-50%, -51%) scale(1.02);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `;

  @consume({ context: open, subscribe: true })
  open!: boolean;

  dialogRef: Ref<HTMLDialogElement> = createRef();

  async firstUpdated() {
    if (!this.dialogRef.value) return;

    // make sure we update the open state when the dialog is closed using Esc.
    this.dialogRef.value.addEventListener('close', () => {
      this.dispatchEvent(
        new CustomEvent('open', {
          bubbles: true,
          composed: true,
          detail: { open: false },
        }) satisfies OpenEvent,
      );
    });
  }

  protected updated(): void {
    if (this.open) {
      return this.dialogRef.value?.showModal();
    }

    this.dialogRef.value?.close();
  }

  render() {
    return html`<dialog class='markprompt-dialog' ${ref(
      this.dialogRef,
    )}><slot></dialog> `;
  }
}
