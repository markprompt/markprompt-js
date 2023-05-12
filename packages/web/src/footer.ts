import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('markprompt-footer')
export class Footer extends LitElement {
  static styles = css`
    markprompt-icon {
      display: inline-block;
      width: var(--markprompt-button-icon-size);
      height: var(--markprompt-button-icon-size);
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--markprompt-muted);
      color: var(--markprompt-mutedForeground);
      padding: 0.375rem 0.75rem;
      border-top: 1px solid var(--markprompt-border);
    }

    p {
      margin: 0;
      display: flex;
      justify-content: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    a {
      color: var(--markprompt-primary);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      text-decoration: none;
    }
  `;

  render() {
    return html`
      <footer>
        <p>
          Powered by
          <a
            href="https://markprompt.com/"
            target="_blank"
            rel="noopener noreferrer"
            ><markprompt-icon></markprompt-icon> Markprompt</a
          >
        </p>
      </footer>
    `;
  }
}
