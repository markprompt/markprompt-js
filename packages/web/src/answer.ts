import { consume } from '@lit-labs/context';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { until } from 'lit/directives/until.js';
import { when } from 'lit/directives/when.js';

import { answer, loadingState, type LoadingState } from './context.js';
import { markdownToHtml } from './markdown-to-html.js';

@customElement('markprompt-answer')
export class Answer extends LitElement {
  static styles = css`
    main {
      box-sizing: border-box;
      width: 100%;
      padding: 1rem 2rem;
      font-size: var(--markprompt-text-size);
      color: var(--markprompt-foreground);
      font-size: 0.875rem;
      line-height: 1.7142857;
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

    main blockquote {
      font-weight: 500;
      font-style: italic;
      color: var(--markprompt-foreground);
      border-left-width: 0.25rem;
      border-left-color: var(--markprompt-border);
      margin-top: 1.3333333em;
      margin-bottom: 1.3333333em;
      padding-left: 1.1111111em;
      quotes: '“' '”' '‘' '’';
    }

    main blockquote p:first-of-type::before {
      content: open-quote;
    }

    main blockquote p:last-of-type::after {
      content: close-quote;
    }

    main h1 {
      color: var(--markprompt-foreground);
      font-weight: 800;
      font-size: 2.1428571em;
      margin-top: 0;
      margin-bottom: 0.8em;
      line-height: 1.2;
    }

    main h1 strong {
      font-weight: 900;
      color: inherit;
    }

    main h2 {
      color: var(--markprompt-foreground);
      font-weight: 700;
      font-size: 1.4285714em;
      margin-top: 1.6em;
      margin-bottom: 0.8em;
      line-height: 1.4;
    }

    main h2 strong {
      font-weight: 800;
      color: inherit;
    }

    main h3 {
      color: var(--markprompt-foreground);
      font-weight: 600;
      font-size: 1.2857143em;
      margin-top: 1.5555556em;
      margin-bottom: 0.4444444em;
      line-height: 1.5555556;
    }

    main h3 strong {
      font-weight: 700;
      color: inherit;
    }

    main h4 {
      color: var(--markprompt-foreground);
      font-weight: 600;
      margin-top: 1.4285714em;
      margin-bottom: 0.5714286em;
      line-height: 1.4285714;
    }

    main h4 strong {
      font-weight: 700;
      color: inherit;
    }

    main img {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    main figure > * {
      margin-top: 0;
      margin-bottom: 0;
    }

    main figcaption {
      color: var(--markprompt-mutedForeground);
      font-size: 0.8571429em;
      line-height: 1.3333333;
      margin-top: 0.6666667em;
    }

    main code {
      color: var(--markprompt-foreground);
      font-weight: 600;
      font-size: 0.8571429em;
    }

    main code::before {
      content: '\`';
    }

    main code::after {
      content: '\`';
    }

    main a code {
      color: inherit;
    }

    main h1 code {
      color: inherit;
    }

    main h2 code {
      color: inherit;
      font-size: 0.9em;
    }

    main h3 code {
      color: inherit;
      font-size: 0.8888889em;
    }

    main h4 code {
      color: inherit;
    }

    main blockquote code {
      color: inherit;
    }

    main thead th code {
      color: inherit;
    }

    main pre {
      color: var(--markprompt-foreground);
      background-color: var(--markprompt-muted);
      border: 1px solid var(--markprompt-border);
      overflow-x: auto;
      font-weight: 400;
      font-size: 0.8571429em;
      line-height: 1.6666667;
      margin-top: 1.6666667em;
      margin-bottom: 1.6666667em;
      border-radius: 0.25rem;
      padding-top: 0.6666667em;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    main pre code {
      background-color: transparent;
      border-width: 0;
      border-radius: 0;
      padding: 0;
      font-weight: inherit;
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
    }

    main pre code::before {
      content: none;
    }

    main pre code::after {
      content: none;
    }

    main table {
      width: 100%;
      table-layout: auto;
      text-align: left;
      margin-top: 2em;
      margin-bottom: 2em;
      font-size: 0.8571429em;
      line-height: 1.5;
    }

    main thead {
      border-bottom-width: 1px;
      border-bottom-color: var(--markprompt-border);
    }

    main thead th {
      color: var(--markprompt-foreground);
      font-weight: 600;
      vertical-align: bottom;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    main tbody tr {
      border-bottom-width: 1px;
      border-bottom-color: var(--markprompt-border);
    }

    main tbody tr:last-child {
      border-bottom-width: 0;
    }

    main tbody td {
      vertical-align: baseline;
    }

    main tfoot {
      border-top-width: 1px;
      border-top-color: var(--markprompt-border);
    }

    main tfoot td {
      vertical-align: top;
    }

    main video {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    main figure {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    main li {
      margin-top: 0.2857143em;
      margin-bottom: 0.2857143em;
    }

    main ol > li {
      padding-left: 0.4285714em;
    }

    main ul > li {
      padding-left: 0.4285714em;
    }

    main > ul > li p {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    main > ul > li > *:first-child {
      margin-top: 1.1428571em;
    }

    main > ul > li > *:last-child {
      margin-bottom: 1.1428571em;
    }

    main > ol > li > *:first-child {
      margin-top: 1.1428571em;
    }

    main > ol > li > *:last-child {
      margin-bottom: 1.1428571em;
    }

    main ul ul,
    main ul ol,
    main ol ul,
    main ol ol {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    main hr + * {
      margin-top: 0;
    }

    main h2 + * {
      margin-top: 0;
    }

    main h3 + * {
      margin-top: 0;
    }

    main h4 + * {
      margin-top: 0;
    }

    main thead th:first-child {
      padding-left: 0;
    }

    main thead th:last-child {
      padding-right: 0;
    }

    main tbody td,
    main tfoot td {
      padding-top: 0.6666667em;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    main tbody td:first-child,
    main tfoot td:first-child {
      padding-left: 0;
    }

    main tbody td:last-child,
    main tfoot td:last-child {
      padding-right: 0;
    }
  `;

  @consume({ context: answer, subscribe: true })
  answer!: string | undefined;

  @consume({ context: loadingState, subscribe: true })
  @state()
  loadingState: LoadingState = 'indeterminate';

  async renderMarkdown() {
    await waitFor(() => this.answer !== undefined && this.answer !== '');
    const html = await markdownToHtml(this.answer!);
    return unsafeHTML(html);
  }

  render() {
    return html`<main>
      ${when(
        this.loadingState === 'indeterminate',
        () => nothing,
        () =>
          until(
            this.renderMarkdown(),
            this.loadingState === 'preload'
              ? html`<markprompt-caret></markprompt-caret>`
              : '',
          ),
      )}
    </main>`;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const waitFor = async function waitFor(f: () => boolean | Promise<boolean>) {
  while (!f()) await sleep(20);
  return f();
};
