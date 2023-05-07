import { consume, createContext, provide } from '@lit-labs/context';
import {
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_I_DONT_KNOW_MESSAGE,
  DEFAULT_LOADING_HEADING,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_PROMPT_TEMPLATE,
  DEFAULT_REFERENCES_HEADING,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  MARKPROMPT_COMPLETIONS_URL,
  type OpenAIModelId,
} from '@markprompt/core';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'markprompt-root': Root;
    'markprompt-dialog': Dialog;
    'markprompt-trigger': Trigger;
  }
}

type State = {
  open: boolean;
  answer?: string;
  prompt?: string;
  references: string[];
  state: 'indeterminate' | 'loading' | 'success';
};

export const stateContext = createContext<State>(Symbol.for('state'));

@customElement('markprompt-root')
export class Root extends LitElement {
  @property({ type: String })
  projectKey = '';

  @property({ type: String })
  completionsUrl = MARKPROMPT_COMPLETIONS_URL;

  @property({ type: Number })
  frequencyPenalty = DEFAULT_FREQUENCY_PENALTY;

  @property({ type: String })
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE;

  @property({ type: Boolean })
  includeBranding = true;

  @property({ type: String })
  loadingHeading = DEFAULT_LOADING_HEADING;

  @property({ type: Number })
  maxTokens = DEFAULT_MAX_TOKENS;

  @property({ type: String })
  model: OpenAIModelId = DEFAULT_MODEL;

  @property({ type: Number })
  presencePenalty = DEFAULT_PRESENCE_PENALTY;

  @property({ type: String })
  promptTemplate = DEFAULT_PROMPT_TEMPLATE;

  @property({ type: String })
  referencesHeading = DEFAULT_REFERENCES_HEADING;

  @property({ type: Number })
  temperature = DEFAULT_TEMPERATURE;

  @property({ type: Number })
  topP = DEFAULT_TOP_P;

  @state()
  open = false;

  @state()
  answer: string | undefined;

  @state()
  prompt: string | undefined;

  @state()
  references: string[] = [];

  @state()
  state: 'indeterminate' | 'loading' | 'success' = 'indeterminate';

  @state()
  controller = new AbortController();

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // abort requests on removal from DOM
    this.controller.abort();
  }

  render() {
    return html`
      <div>
        <markprompt-trigger
          @handleClick=${() => {
            this.open = !this.open;
          }}
          >open</markprompt-trigger
        >
        <markprompt-dialog ?open="{this.open}">
          <slot />
        </markprompt-dialog>
      </div>
    `;
  }
}

@customElement('markprompt-dialog')
class Dialog extends LitElement {
  @property({ type: Boolean })
  open = false;

  render() {
    return html`<dialog ?open=${this.open}><slot /></dialog> `;
  }
}

@customElement('markprompt-trigger')
class Trigger extends LitElement {
  @property({ type: Function })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClick = () => {};

  @consume({ context: stateContext })
  state: State | undefined;

  render() {
    return html`
      <button @click=${this.handleClick}>
        <slot />
      </button>
    `;
  }
}
