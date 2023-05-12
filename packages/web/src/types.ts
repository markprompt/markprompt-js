export type OpenEvent = CustomEvent<{ open: boolean }>;
export type PromptEvent = CustomEvent<{ prompt: string }>;
export type SubmitPromptEvent = CustomEvent<never>;
