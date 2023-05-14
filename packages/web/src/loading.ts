import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('markprompt-loading')
export class Loading extends LitElement {
  static styles = css`
    .progress {
      position: absolute;
      top: -2px;
      left: 0;
      height: 2px;
      background-image: linear-gradient(
        to right,
        var(--markprompt-primaryHighlight),
        var(--markprompt-secondaryHighlight)
      );
      animation-name: progress;
      animation-duration: 2s;
      animation-fill-mode: none;
      animation-iteration-count: infinite;
      transition-timing-function: cubic-bezier(0.14, 0, 0.16, 1);
      transition: opacity 200ms ease;
    }

    @keyframes progress {
      0% {
        width: 0;
        transform: translateX(0);
      }
      50% {
        width: 100%;
        transform: translateX(0);
      }
      100% {
        width: 100%;
        transform: translateX(100%);
      }
    }
  `;

  render() {
    return html`
      <div class="progress"></div>
      <p>Fetching relevant pages…</p>
    `;
  }
}
