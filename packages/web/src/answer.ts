import { consume } from '@lit-labs/context';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { until } from 'lit/directives/until.js';

import { answer, loadingState, type LoadingState } from './context.js';
import { markdownToHtml } from './markdown-to-html.js';

@customElement('markprompt-answer')
export class Answer extends LitElement {
  static styles = css`
    :host {
      max-height: 100%;
      position: relative;
    }

    main {
      box-sizing: border-box;
      position: absolute;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem 2rem;
      font-size: var(--markprompt-text-size);
      color: var(--markprompt-foreground);
      font-size: 0.875rem;
      line-height: 1.7142857;
      scroll-behavior: smooth;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    main::-webkit-scrollbar {
      display: none;
    }

    main :not(:last-child) .caret {
      display: none;
    }

    main p {
      margin-top: 1.1428571em;
      margin-bottom: 1.1428571em;
    }

    main a {
      color: var(--markprompt-primary);
      text-decoration: underline;
      font-weight: 500;
    }

    main strong {
      font-weight: 600;
    }

    main a strong {
      color: inherit;
    }

    main blockquote strong {
      color: inherit;
    }

    main thead th strong {
      color: inherit;
    }

    main ol {
      list-style-type: decimal;
      margin-top: 1.1428571em;
      margin-bottom: 1.1428571em;
      padding-left: 1.5714286em;
    }

    main ol[type='A'] {
      list-style-type: upper-alpha;
    }

    main ol[type='a'] {
      list-style-type: lower-alpha;
    }

    main ol[type='A' s] {
      list-style-type: upper-alpha;
    }

    main ol[type='a' s] {
      list-style-type: lower-alpha;
    }

    main ol[type='I'] {
      list-style-type: upper-roman;
    }

    main ol[type='i'] {
      list-style-type: lower-roman;
    }

    main ol[type='I' s] {
      list-style-type: upper-roman;
    }

    main ol[type='i' s] {
      list-style-type: lower-roman;
    }

    main ol[type='1'] {
      list-style-type: decimal;
    }

    main ol > li::marker {
      font-weight: 400;
      color: var(--markprompt-foreground);
    }

    main ul {
      list-style-type: disc;
      margin-top: 1.1428571em;
      margin-bottom: 1.1428571em;
      padding-left: 1.5714286em;
    }

    main ul > li::marker {
      color: var(--markprompt-mutedForeground);
    }

    main hr {
      border-color: var(--markprompt-border);
      border-top-width: 1;
      margin-top: 2.8571429em;
      margin-bottom: 2.8571429em;
    }
  `;

  @consume({ context: answer, subscribe: true })
  answer!: string | undefined;

  @consume({ context: loadingState, subscribe: true })
  loadingState!: LoadingState;

  async renderMarkdown() {
    if (!this.answer) return;
    const html = await markdownToHtml(this.answer);
    return unsafeHTML(html);
  }

  render() {
    return html`<main>
      ${until(
        this.renderMarkdown(),
        this.loadingState === 'preload' ? 'loading…' : '',
      )}
    </main>`;
  }
}
