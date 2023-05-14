import { consume } from '@lit-labs/context';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { loadingState, references, type LoadingState } from './context.js';

@customElement('markprompt-references')
export class References extends LitElement {
  static styles = css`
    ul {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0.5rem;
      list-style-type: none;
      margin-top: 2.25rem;
      padding-left: 2rem;
      padding-bottom: 2rem;
      overflow-x: auto;
      min-width: 100%;
      width: 0;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    ul::-webkit-scrollbar {
      display: none;
    }

    li {
      font-size: 0.875rem;
      line-height: 1.5rem;
      animation-name: slide-up;
      animation-duration: 1s;
      animation-fill-mode: both;
      transition-timing-function: ease-in-out;
    }

    li a {
      display: inline-block;
      text-decoration: none;
      padding: 0.125rem 0.5rem;
      border: 1px solid var(--markprompt-border);
      border-radius: 0.375rem;
      color: var(--markprompt-primary);
      font-weight: 500;
      transition-property: opacity;
      transition-duration: 200ms;
      white-space: nowrap;
    }

    li a:hover {
      opacity: 0.8;
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  @consume({ context: loadingState, subscribe: true })
  loadingState: LoadingState = 'indeterminate';

  @consume({ context: references, subscribe: true })
  references: string[] = [];

  capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  removeFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName;
    }
    return fileName.substring(0, lastDotIndex);
  }

  render() {
    return html`
      <div>
        <p>Answer generated from the following sources:</p>
        ${map(
          this.references,
          (reference, index) => html`<li
            style=${`animation-delay: ${100 * index}ms;`}
          >
            <a href=${this.removeFileExtension(reference)}>
              ${this.capitalize(
                this.removeFileExtension(reference.split('/').slice(-1)[0]),
              )}</a
            >
          </li>`,
        )}
      </div>
    `;
  }
}
