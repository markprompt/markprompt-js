var u=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var r=(l,p,e,o)=>{for(var i=o>1?void 0:o?v(p,e):p,c=l.length-1,d;c>=0;c--)(d=l[c])&&(i=(o?d(p,e,i):d(i))||i);return o&&i&&u(p,e,i),i};import{LitElement as w,html as n,css as g,nothing as m}from"lit";import{customElement as f,property as s}from"lit/decorators.js";import{classMap as b}from"lit/directives/class-map.js";import{I_DONT_KNOW_MESSAGE as y,MARKPROMPT_COMPLETIONS_URL as x,DEFAULT_MODEL as z,submitPrompt as k}from"@markprompt/core";import{unified as T}from"unified";import S from"remark-parse";import q from"remark-rehype";import I from"rehype-sanitize";import $ from"rehype-stringify";import E from"remark-gfm";import{until as R}from"lit/directives/until.js";import{unsafeHTML as A}from"lit/directives/unsafe-html.js";let t=class extends w{constructor(){super(...arguments);this.model=z;this.iDontKnowMessage=y;this.completionsUrl=x;this.projectKey="";this.placeholder="Ask me anything\u2026";this.prompt="";this.idToRefMap={};this.loading=!1;this.answer="";this.references=[]}onInput(e){const o=e.target;this.prompt=o.value}scrollToBottom(){const e=this.renderRoot.querySelector("#result");e.scrollTop=e.scrollHeight}getRefFromId(e){}reset(){const e=this.renderRoot.querySelector("#prompt-input");e.value="",this.answer="",this.references=[],this.loading=!1}focus(){this.renderRoot.querySelector("#prompt-input").focus()}async onSubmit(e){e.preventDefault(),this.prompt!==""&&(this.answer="",this.references=[],this.loading=!0,console.log("this.promptTemplate",this.promptTemplate),await k(this.prompt,this.projectKey,o=>{this.scrollToBottom(),this.answer+=o},o=>{this.scrollToBottom(),this.references=o},{model:this.model,iDontKnowMessage:this.iDontKnowMessage,completionsUrl:this.completionsUrl,...this.promptTemplate?{promptTemplate:this.promptTemplate}:{}}),this.loading=!1)}async renderMarkdown(e){const o=await T().use(S).use(E).use(q,{allowDangerousHtml:!0}).use(I).use($).process(e);return typeof o.value!="string"?"":A(o.value)}render(){return n`
      <div class="root">
        <div class="input-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>

          <form class="prompt-form" @submit="${this.onSubmit}">
            <input
              id="prompt-input"
              class="prompt-input"
              type="text"
              name="prompt"
              @input="${this.onInput}"
              placeholder="${this.placeholder}"
              value="${this.prompt}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus
            />
          </form>
        </div>

        <div class="gradient"></div>
        <prose-block class="result" id="result">
          <div class="answer prose">
            ${this.loading&&!(this.answer.length>0)?n`<animated-caret class="caret"></animated-caret>`:m}
            ${R(this.renderMarkdown(this.answer),m)}
            ${this.loading&&this.answer.length>0?n`<animated-caret class="caret"></animated-caret>`:m}
          </div>
          ${this.answer.length>0&&this.references.length>0?n`
                <div class="references-container">
                  <div
                    class="${b({"animate-slide-up":!this.loading})}"
                  >
                    <p>Generated from the following sources:</p>
                    <div class="references">
                      ${this.references.map(e=>{let o=this.idToRefMap?this.idToRefMap[e]:void 0;return o||(o=this.getRefFromId(e)),o&&o.href?n`<a
                            href="${o.href}"
                            class="reference-item"
                          >
                            ${o.label||e}</a
                          >`:n`<div class="reference-item">
                          ${e}
                        </div>`})}
                    </div>
                  </div>
                </div>
              `:m}
          <div class="spacer"></div>
        </prose-block>
      </div>
    `}};t.styles=g`
    .root {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .input-container {
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      border-bottom-width: 1px;
      background-color: var(--input-bg-color);
      border-color: var(--border-color);
      height: 3rem;
    }

    .input-container svg {
      height: 20px;
      width: 20px;
      color: var(--search-icon-color);
      flex: none;
    }

    .prompt-form {
      flex-grow: 1;
    }

    .prompt-input {
      box-sizing: border-box;
      width: 100%;
      padding: 4px;
      appearance: none;
      border-radius: 0.375rem;
      border-width: 0px;
      background-color: transparent;
      color: var(--text-color);
      font-size: 1rem;
    }

    .prompt-input::placeholder {
      color: var(--input-placeholder-color);
    }

    .prompt-input:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 0 black;
    }

    .gradient {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      height: 2.5rem;
    }

    .result {
      box-sizing: border-box;
      border-top: 1px solid var(--border-color);
      background-color: var(--result-bg-color);
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 3rem;
      z-index: 0;
      max-width: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .result::-webkit-scrollbar {
      display: none;
    }

    .answer {
      padding: 2rem;
      color: var(--text-color);
    }

    .answer img {
      max-width: 100%;
    }

    .answer a {
      color: var(--link-color);
    }

    .spacer {
      height: 2rem;
    }

    .references-container {
      border-top: 1px solid var(--border-color);
      padding: 2rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: rgb(115 115 115 / 1);
    }

    .references {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .reference-item {
      font-weight: 600;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
      color: var(--accent-color);
      text-decoration: none;
      background-color: var(--reference-item-bg-color);
      transition-property: background-color, border-color, color, fill, stroke,
        opacity, box-shadow, transform;
      transition-duration: 200ms;
    }

    .reference-item:hover {
      background-color: var(--reference-item-bg-color-hover);
    }

    .caret {
      color: var(--caret-color);
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

    .animate-slide-up {
      animation-name: slide-up;
      animation-duration: 1s;
      animation-fill-mode: both;
      transition-timing-function: ease-in-out;
    }
  `,r([s({type:String})],t.prototype,"model",2),r([s({type:String})],t.prototype,"promptTemplate",2),r([s({type:String})],t.prototype,"iDontKnowMessage",2),r([s({type:String})],t.prototype,"completionsUrl",2),r([s({type:String})],t.prototype,"projectKey",2),r([s({type:String})],t.prototype,"placeholder",2),r([s({type:String,state:!0})],t.prototype,"prompt",2),r([s({type:Object})],t.prototype,"idToRefMap",2),r([s({type:Boolean,state:!0})],t.prototype,"loading",2),r([s({type:String,state:!0})],t.prototype,"answer",2),r([s({type:Array,state:!0})],t.prototype,"references",2),t=r([f("markprompt-content")],t);let h=class extends w{render(){return n`<span></span>`}};h.styles=g`
    :host {
      display: inline-block;
      width: 8px;
      height: 15px;
      background-color: currentColor;
      animation: blink 1s infinite;
      transform: matrix(1, 0, 0, 1, 2, 2);
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, currentColor 0px 0px 3px 0px;
      border-radius: 1px;
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,h=r([f("animated-caret")],h);let a=class extends w{constructor(){super(...arguments);this.class=""}render(){return n`
      <div
        class="${b({prose:!0,[this.class]:this.class.length>0})}"
      >
        <slot></slot>
      </div>
    `}};a.styles=g`
    .prose {
      color: var(--tw-prose-body);
      max-width: 65ch;
    }

    .prose :where([class~='lead']):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-lead);
      font-size: 1.25em;
      line-height: 1.6;
      margin-top: 1.2em;
      margin-bottom: 1.2em;
    }

    .prose :where(a):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-links);
      text-decoration: underline;
      font-weight: 500;
    }

    .prose :where(strong):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-bold);
      font-weight: 600;
    }

    .prose :where(ol):not(:where([class~='not-prose'] *)) {
      list-style-type: decimal;
      padding-left: 1.625em;
    }

    .prose :where(ol[type='A']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-alpha;
    }

    .prose :where(ol[type='a']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-alpha;
    }

    .prose :where(ol[type='A']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-alpha;
    }

    .prose :where(ol[type='a']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-alpha;
    }

    .prose :where(ol[type='I']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-roman;
    }

    .prose :where(ol[type='i']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-roman;
    }

    .prose :where(ol[type='I']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-roman;
    }

    .prose :where(ol[type='i']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-roman;
    }

    .prose :where(ol[type='1']):not(:where([class~='not-prose'] *)) {
      list-style-type: decimal;
    }

    .prose :where(ul):not(:where([class~='not-prose'] *)) {
      list-style-type: disc;
      padding-left: 1.625em;
    }

    .prose :where(ol > li):not(:where([class~='not-prose'] *))::marker {
      font-weight: 400;
      color: var(--tw-prose-counters);
    }

    .prose :where(ul > li):not(:where([class~='not-prose'] *))::marker {
      color: var(--tw-prose-bullets);
    }

    .prose :where(hr):not(:where([class~='not-prose'] *)) {
      border-color: var(--tw-prose-hr);
      border-top-width: 1px;
      margin-top: 3em;
      margin-bottom: 3em;
    }

    .prose :where(blockquote):not(:where([class~='not-prose'] *)) {
      font-weight: 500;
      font-style: italic;
      color: var(--tw-prose-quotes);
      border-left-width: 0.25rem;
      border-left-color: var(--tw-prose-quote-borders);
      quotes: '\201C''\201D''\2018''\2019';
      margin-top: 1.6em;
      margin-bottom: 1.6em;
      padding-left: 1em;
    }

    .prose
      :where(blockquote p:first-of-type):not(
        :where([class~='not-prose'] *)
      )::before {
      content: open-quote;
    }

    .prose
      :where(blockquote p:last-of-type):not(
        :where([class~='not-prose'] *)
      )::after {
      content: close-quote;
    }

    .prose :where(h1):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 800;
      font-size: 2.25em;
      margin-top: 0;
      margin-bottom: 0.8888889em;
      line-height: 1.1111111;
    }

    .prose :where(h1 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 900;
    }

    .prose :where(h2):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 700;
      font-size: 1.5em;
      margin-top: 2em;
      margin-bottom: 1em;
      line-height: 1.3333333;
    }

    .prose :where(h2 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 800;
    }

    .prose :where(h3):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      font-size: 1.25em;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      line-height: 1.6;
    }

    .prose :where(h3 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 700;
    }

    .prose :where(h4):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.5;
    }

    .prose :where(h4 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 700;
    }

    .prose :where(figure > *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
      margin-bottom: 0;
    }

    .prose :where(figcaption):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-captions);
      font-size: 0.875em;
      line-height: 1.4285714;
      margin-top: 0.8571429em;
    }

    .prose :where(code):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-code);
      font-weight: 600;
      font-size: 0.875em;
    }

    .prose :where(code):not(:where([class~='not-prose'] *))::before {
      content: '\`';
    }

    .prose :where(code):not(:where([class~='not-prose'] *))::after {
      content: '\`';
    }

    .prose :where(a code):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-links);
    }

    .prose :where(pre):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-pre-code);
      background-color: var(--tw-prose-pre-bg);
      overflow-x: auto;
      font-weight: 400;
      font-size: 0.875em;
      line-height: 1.7142857;
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
      border-radius: 0.375rem;
      padding-top: 0.8571429em;
      padding-right: 1.1428571em;
      padding-bottom: 0.8571429em;
      padding-left: 1.1428571em;
    }

    .prose :where(pre code):not(:where([class~='not-prose'] *)) {
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

    .prose :where(pre code):not(:where([class~='not-prose'] *))::before {
      content: none;
    }

    .prose :where(pre code):not(:where([class~='not-prose'] *))::after {
      content: none;
    }

    .prose :where(table):not(:where([class~='not-prose'] *)) {
      width: 100%;
      table-layout: auto;
      text-align: left;
      margin-top: 2em;
      margin-bottom: 2em;
      font-size: 0.875em;
      line-height: 1.7142857;
    }

    .prose :where(thead):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 1px;
      border-bottom-color: var(--tw-prose-th-borders);
    }

    .prose :where(thead th):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      vertical-align: bottom;
      padding-right: 0.5714286em;
      padding-bottom: 0.5714286em;
      padding-left: 0.5714286em;
    }

    .prose :where(tbody tr):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 1px;
      border-bottom-color: var(--tw-prose-td-borders);
    }

    .prose :where(tbody tr:last-child):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 0;
    }

    .prose :where(tbody td):not(:where([class~='not-prose'] *)) {
      vertical-align: baseline;
      padding-top: 0.5714286em;
      padding-right: 0.5714286em;
      padding-bottom: 0.5714286em;
      padding-left: 0.5714286em;
    }

    .prose {
      --tw-prose-body: #374151;
      --tw-prose-headings: #111827;
      --tw-prose-lead: #4b5563;
      --tw-prose-links: #111827;
      --tw-prose-bold: #111827;
      --tw-prose-counters: #6b7280;
      --tw-prose-bullets: #d1d5db;
      --tw-prose-hr: #e5e7eb;
      --tw-prose-quotes: #111827;
      --tw-prose-quote-borders: #e5e7eb;
      --tw-prose-captions: #6b7280;
      --tw-prose-code: #111827;
      --tw-prose-pre-code: #e5e7eb;
      --tw-prose-pre-bg: #1f2937;
      --tw-prose-th-borders: #d1d5db;
      --tw-prose-td-borders: #e5e7eb;
      --tw-prose-invert-body: #d1d5db;
      --tw-prose-invert-headings: #fff;
      --tw-prose-invert-lead: #9ca3af;
      --tw-prose-invert-links: #fff;
      --tw-prose-invert-bold: #fff;
      --tw-prose-invert-counters: #9ca3af;
      --tw-prose-invert-bullets: #4b5563;
      --tw-prose-invert-hr: #374151;
      --tw-prose-invert-quotes: #f3f4f6;
      --tw-prose-invert-quote-borders: #374151;
      --tw-prose-invert-captions: #9ca3af;
      --tw-prose-invert-code: #fff;
      --tw-prose-invert-pre-code: #d1d5db;
      --tw-prose-invert-pre-bg: rgb(0 0 0 / 50%);
      --tw-prose-invert-th-borders: #4b5563;
      --tw-prose-invert-td-borders: #374151;
      font-size: 1rem;
      line-height: 1.75;
    }

    .prose :where(p):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
    }

    .prose :where(img):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(video):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(figure):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(h2 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.875em;
    }

    .prose :where(h3 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.9em;
    }

    .prose :where(li):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }

    .prose :where(ol > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.375em;
    }

    .prose :where(ul > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.375em;
    }

    .prose > :where(ul > li p):not(:where([class~='not-prose'] *)) {
      margin-top: 0.75em;
      margin-bottom: 0.75em;
    }

    .prose
      > :where(ul > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
    }

    .prose
      > :where(ul > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.25em;
    }

    .prose
      > :where(ol > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
    }

    .prose
      > :where(ol > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.25em;
    }

    .prose
      :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~='not-prose'] *)) {
      margin-top: 0.75em;
      margin-bottom: 0.75em;
    }

    .prose :where(hr + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h2 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h3 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h4 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(thead th:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose :where(thead th:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose :where(tbody td:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose :where(tbody td:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose > :where(:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose > :where(:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 0;
    }

    .prose-sm {
      font-size: 0.875rem;
      line-height: 1.7142857;
    }

    .prose-sm :where(p):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
      margin-bottom: 1.1428571em;
    }

    .prose-sm :where([class~='lead']):not(:where([class~='not-prose'] *)) {
      font-size: 1.2857143em;
      line-height: 1.5555556;
      margin-top: 0.8888889em;
      margin-bottom: 0.8888889em;
    }

    .prose-sm :where(blockquote):not(:where([class~='not-prose'] *)) {
      margin-top: 1.3333333em;
      margin-bottom: 1.3333333em;
      padding-left: 1.1111111em;
    }

    .prose-sm :where(h1):not(:where([class~='not-prose'] *)) {
      font-size: 2.1428571em;
      margin-top: 0;
      margin-bottom: 0.8em;
      line-height: 1.2;
    }

    .prose-sm :where(h2):not(:where([class~='not-prose'] *)) {
      font-size: 1.4285714em;
      margin-top: 1.6em;
      margin-bottom: 0.8em;
      line-height: 1.4;
    }

    .prose-sm :where(h3):not(:where([class~='not-prose'] *)) {
      font-size: 1.2857143em;
      margin-top: 1.5555556em;
      margin-bottom: 0.4444444em;
      line-height: 1.5555556;
    }

    .prose-sm :where(h4):not(:where([class~='not-prose'] *)) {
      margin-top: 1.4285714em;
      margin-bottom: 0.5714286em;
      line-height: 1.4285714;
    }

    .prose-sm :where(img):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(video):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(figure):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(figure > *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
      margin-bottom: 0;
    }

    .prose-sm :where(figcaption):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
      line-height: 1.3333333;
      margin-top: 0.6666667em;
    }

    .prose-sm :where(code):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
    }

    .prose-sm :where(h2 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.9em;
    }

    .prose-sm :where(h3 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.8888889em;
    }

    .prose-sm :where(pre):not(:where([class~='not-prose'] *)) {
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

    .prose-sm :where(ol):not(:where([class~='not-prose'] *)) {
      padding-left: 1.5714286em;
    }

    .prose-sm :where(ul):not(:where([class~='not-prose'] *)) {
      padding-left: 1.5714286em;
    }

    .prose-sm :where(li):not(:where([class~='not-prose'] *)) {
      margin-top: 0.2857143em;
      margin-bottom: 0.2857143em;
    }

    .prose-sm :where(ol > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.4285714em;
    }

    .prose-sm :where(ul > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.4285714em;
    }

    .prose-sm > :where(ul > li p):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    .prose-sm
      > :where(ul > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
    }

    .prose-sm
      > :where(ul > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.1428571em;
    }

    .prose-sm
      > :where(ol > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
    }

    .prose-sm
      > :where(ol > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.1428571em;
    }

    .prose-sm
      :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    .prose-sm :where(hr):not(:where([class~='not-prose'] *)) {
      margin-top: 2.8571429em;
      margin-bottom: 2.8571429em;
    }

    .prose-sm :where(hr + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h2 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h3 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h4 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(table):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
      line-height: 1.5;
    }

    .prose-sm :where(thead th):not(:where([class~='not-prose'] *)) {
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    .prose-sm :where(thead th:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose-sm :where(thead th:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose-sm :where(tbody td):not(:where([class~='not-prose'] *)) {
      padding-top: 0.6666667em;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    .prose-sm :where(tbody td:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose-sm :where(tbody td:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose-sm > :where(:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm > :where(:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 0;
    }
  `,r([s({type:String})],a.prototype,"class",2),a=r([f("prose-block")],a);export{h as Caret,t as Markprompt,a as ProseBlock};
