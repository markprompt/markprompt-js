import { consume } from '@lit-labs/context';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { prompt } from './context.js';
import type { PromptEvent, SubmitPromptEvent } from './types.js';

@customElement('markprompt-form')
export class Form extends LitElement {
  static styles = css`
    form {
      background-color: var(--markprompt-background);
    }

    form label {
      position: relative;
    }

    markprompt-search-icon {
      display: block;
      height: var(--markprompt-button-icon-size);
      position: absolute;
      top: 50%;
      left: 1.25rem;
      transform: translateY(-50%);
      color: var(--markprompt-foreground);
    }

    input {
      outline: none;
      border: none;
      border-bottom: 1px solid var(--markprompt-border);
      box-shadow: none;
      width: 100%;
      padding-block: 1rem;
      padding-inline: 3.5rem;
      background-color: none;
      font-size: var(--markprompt-text-size);
      color: var(--markprompt-foreground);
      caret-color: var(--markprompt-primary);
    }

    input::placeholder {
      color: var(--markprompt-mutedForeground);
    }
  `;

  @property({ type: String })
  placeholder = 'Ask me anything…';

  @consume({ context: prompt, subscribe: true })
  prompt!: string | undefined;

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('submit-prompt', {
        bubbles: true,
        composed: true,
      }) satisfies SubmitPromptEvent,
    );
  }

  async handleInput(event: InputEvent) {
    if (!event.target) return;
    if (!(event.target instanceof HTMLInputElement)) return;

    this.dispatchEvent(
      new CustomEvent('prompt', {
        bubbles: true,
        composed: true,
        detail: { prompt: event.target.value },
      }) satisfies PromptEvent,
    );
  }

  render() {
    return html`
      <form method="dialog" @submit=${this.handleSubmit}>
        <label>
          <markprompt-search-icon></markprompt-search-icon>
          <input
            type="text"
            name="prompt"
            @input=${this.handleInput}
            .value=${this.prompt ? this.prompt : ''}
            placeholder=${this.placeholder}
          />
        </label>
      </form>
    `;
  }
}
