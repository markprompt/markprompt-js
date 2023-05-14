import { LitElement, css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('markprompt-caret')
export class Caret extends LitElement {
  static styles = css`
    span {
      display: inline-block;
      height: 1rem;
      width: 0.5rem;
      margin-left: 0.2rem;
      margin-top: 1.1428571em;
      transform: translate(2px, 2px);
      border-radius: 1px;
      background-color: var(--markprompt-primary);
      box-shadow: 0 0 3px 0 var(--markprompt-primary);
      animation-name: blink;
      animation-duration: 1000ms;
      animation-fill-mode: both;
      animation-iteration-count: infinite;
      transition-timing-function: cubic-bezier(0.14, 0, 0.16, 1);
    }

    @keyframes blink {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;

  render() {
    return html`<span></span>`;
  }
}
