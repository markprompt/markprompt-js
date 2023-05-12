import { provide } from '@lit-labs/context';
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
  submitPrompt,
  type OpenAIModelId,
  DEFAULT_SECTIONS_MATCH_COUNT,
  DEFAULT_SECTIONS_MATCH_THRESHOLD,
} from '@markprompt/core';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import {
  answer,
  controller,
  loadingState,
  open,
  prompt,
  references,
  type LoadingState,
} from './context.js';

@customElement('markprompt-root')
export class Root extends LitElement {
  static styles = css`
    :host {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      font-weight: 400;

      color-scheme: light dark;
      color: rgba(255, 255, 255, 0.87);
      background-color: #ffffff;

      font-synthesis: none;
      text-rendering: optimizeLegibility;
      text-align: initial;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-text-size-adjust: 100%;
    }

    :host {
      box-sizing: border-box;
    }

    :host *,
    :host *:before,
    :host *:after {
      box-sizing: inherit;
    }

    :host {
      --markprompt-background: #ffffff;
      --markprompt-foreground: #171717;
      --markprompt-muted: #fafafa;
      --markprompt-mutedForeground: #737373;
      --markprompt-border: #e5e5e5;
      --markprompt-input: #ffffff;
      --markprompt-primary: #6366f1;
      --markprompt-primaryForeground: #ffffff;
      --markprompt-secondary: #fafafa;
      --markprompt-secondaryForeground: #171717;
      --markprompt-primaryHighlight: #ec4899;
      --markprompt-secondaryHighlight: #a855f7;
      --markprompt-overlay: #00000010;
      --markprompt-ring: #0ea5e9;
      --markprompt-radius: 8px;
      --markprompt-text-size: 0.875rem;
      --markprompt-button-icon-size: 1rem;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --markprompt-background: #050505;
        --markprompt-foreground: #d4d4d4;
        --markprompt-muted: #171717;
        --markprompt-mutedForeground: #737373;
        --markprompt-border: #262626;
        --markprompt-input: #ffffff;
        --markprompt-primary: #6366f1;
        --markprompt-primaryForeground: #ffffff;
        --markprompt-secondary: #0e0e0e;
        --markprompt-secondaryForeground: #ffffff;
        --markprompt-primaryHighlight: #ec4899;
        --markprompt-secondaryHighlight: #a855f7;
        --markprompt-overlay: #00000040;
        --markprompt-ring: #ffffff;
      }
    }
  `;

  @property({ type: String, attribute: 'project-key' })
  projectKey = undefined;

  @property({ type: String, attribute: 'completions-url' })
  completionsUrl = MARKPROMPT_COMPLETIONS_URL;

  @property({ type: Number, attribute: 'frequency-penalty' })
  frequencyPenalty = DEFAULT_FREQUENCY_PENALTY;

  @property({ type: String, attribute: 'i-dont-know-message' })
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE;

  @property({ type: Boolean, attribute: 'include-branding' })
  includeBranding = true;

  @property({ type: String, attribute: 'loading-heading' })
  loadingHeading = DEFAULT_LOADING_HEADING;

  @property({ type: Number, attribute: 'max-tokens' })
  maxTokens = DEFAULT_MAX_TOKENS;

  @property({ type: String })
  model: OpenAIModelId = DEFAULT_MODEL;

  @property({ type: String })
  placeholder = 'Ask me anything…';

  @property({ type: Number, attribute: 'presence-penalty' })
  presencePenalty = DEFAULT_PRESENCE_PENALTY;

  @property({ type: String, attribute: 'prompt-template' })
  promptTemplate = DEFAULT_PROMPT_TEMPLATE;

  @property({ type: String, attribute: 'references-heading' })
  referencesHeading = DEFAULT_REFERENCES_HEADING;

  @property({ type: Number, attribute: 'temperature' })
  temperature = DEFAULT_TEMPERATURE;

  @property({ type: Number, attribute: 'top-p' })
  topP = DEFAULT_TOP_P;

  @property({ type: Number, attribute: 'sections-match-count' })
  sectionsMatchCount = DEFAULT_SECTIONS_MATCH_COUNT;

  @property({ type: Number, attribute: 'sections-match-threshold' })
  sectionsMatchThreshold = DEFAULT_SECTIONS_MATCH_THRESHOLD;

  @provide({ context: open })
  @state()
  open = false;

  @provide({ context: answer })
  @state()
  answer: string | undefined = undefined;

  @provide({ context: prompt })
  @state()
  prompt: string | undefined = undefined;

  @provide({ context: references })
  @state()
  references: string[] = [];

  @provide({ context: loadingState })
  @state()
  loadingState: LoadingState = 'indeterminate';

  @provide({ context: controller })
  @state()
  controller: AbortController | undefined = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.isConnected) return;
    if (this.projectKey) return;

    throw new Error(
      '[markprompt]: the project-key attribute is required. See https://markprompt.com/docs#web-component',
    );
  }

  async firstUpdated() {
    // await the first paint
    await new Promise((r) => setTimeout(r, 0));

    this.addEventListener('open', (event) => {
      this.open = event.detail.open;
      if (event.detail.open) return;

      // reset state on close
      this.controller?.abort('closed');
      this.controller = undefined;
      this.prompt = undefined;
      this.answer = undefined;
      this.references = [];
      this.loadingState = 'indeterminate';
    });

    this.addEventListener('prompt', (event) => {
      this.prompt = event.detail.prompt;
    });

    this.addEventListener('submit-prompt', () => {
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    if (!this.prompt) return;
    if (!this.projectKey) return;

    this.answer = '';
    this.references = [];
    this.controller = new AbortController();

    const promise = submitPrompt(
      this.prompt,
      this.projectKey,
      (chunk) => {
        this.loadingState = 'streaming-answer';
        this.answer += chunk;
        return true;
      },
      (references) => {
        this.references = references;
      },
      (error) => {
        console.error(error);
        this.controller?.abort('error');
      },
      {
        completionsUrl: this.completionsUrl,
        iDontKnowMessage: this.iDontKnowMessage,
        referencesHeading: this.referencesHeading,
        loadingHeading: this.loadingHeading,
        includeBranding: this.includeBranding,
        model: this.model,
        promptTemplate: this.promptTemplate,
        temperature: this.temperature,
        topP: this.topP,
        frequencyPenalty: this.frequencyPenalty,
        presencePenalty: this.presencePenalty,
        maxTokens: this.maxTokens,
        sectionsMatchCount: this.sectionsMatchCount,
        sectionsMatchThreshold: this.sectionsMatchThreshold,
        signal: this.controller.signal,
      },
    );

    promise.then(() => {
      this.loadingState = 'done';
    });

    promise.finally(() => {
      this.controller = undefined;
    });
  }

  render() {
    return html`
      <markprompt-trigger></markprompt-trigger>
      <markprompt-dialog>
        <markprompt-form placeholder=${this.placeholder}></markprompt-form>
        <markprompt-answer></markprompt-answer>
        <markprompt-footer></markprompt-footer>
      </markprompt-dialog>
    `;
  }
}

@customElement('markprompt-visually-hidden')
export class VisuallyHidden extends LitElement {
  static styles = css`
    :host {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
