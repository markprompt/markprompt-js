import { LitElement } from 'lit';
import { OpenAIModelId } from '@markprompt/core';
export declare class Markprompt extends LitElement {
    model: OpenAIModelId;
    iDontKnowMessage: "Sorry, I am not sure how to answer that.";
    completionsUrl: "https://api.markprompt.com/v1/completions";
    projectKey: string;
    dark: boolean;
    placeholder: string;
    prompt: string;
    loading: boolean;
    answer: string;
    references: any[];
    static styles: import("lit").CSSResult;
    onInput(event: Event): void;
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