import { OpenAIModelId } from '@markprompt/core';
import { LitElement } from 'lit';
import { Ref } from 'lit/directives/ref.js';
declare global {
    interface HTMLElementTagNameMap {
        'animated-caret': Caret;
        'markprompt-content': Markprompt;
        'prose-block': ProseBlock;
    }
}
export declare class Markprompt extends LitElement {
    model: OpenAIModelId;
    promptTemplate: string;
    iDontKnowMessage: "Sorry, I am not sure how to answer that.";
    completionsUrl: "https://api.markprompt.com/v1/completions";
    projectKey: string;
    placeholder: string;
    prompt: string;
    idToRefMap: {};
    loading: boolean;
    answer: string;
    references: any[];
    inputRef: Ref<HTMLInputElement>;
    resultRef: Ref<HTMLDivElement>;
    static styles: import("lit").CSSResult;
    onInput(event: Event): void;
    scrollToBottom(): void;
    getRefFromId(id: string): any;
    reset(): void;
    focus(): void;
    onSubmit(event: Event): Promise<void>;
    renderMarkdown(markdown: string): Promise<import("lit-html/directive").DirectiveResult<typeof import("lit-html/directives/unsafe-html").UnsafeHTMLDirective>>;
    render(): import("lit-html").TemplateResult<1>;
}
export declare class Caret extends LitElement {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
export declare class ProseBlock extends LitElement {
    class: string;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=markprompt-content.d.ts.map