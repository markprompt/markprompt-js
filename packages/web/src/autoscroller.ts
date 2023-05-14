import { consume } from '@lit-labs/context';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { answer } from './context.js';

@customElement('markprompt-autoscroller')
export class Autoscroller extends LitElement {
  static styles = css`
    .root {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .scroller {
      position: absolute;
      inset: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .scroller::-webkit-scrollbar {
      display: none;
    }
  `;

  @consume({ context: answer, subscribe: true })
  answer!: string | undefined;

  scroller = createRef<HTMLDivElement>();

  updated() {
    if (!this.scroller.value) return;
    if (!this.answer) return;

    this.scroller.value.scrollTo({
      top: this.scroller.value.scrollHeight,
      behavior: 'smooth',
    });
  }

  render() {
    return html`
      <div class="root">
        <div class="scroller" ${ref(this.scroller)}>
          <slot>
        </div>
      </div>`;
  }
}
