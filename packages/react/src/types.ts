import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionSystemMessageParam,
  ChatCompletionTool,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
  SubmitChatOptions,
  ChatCompletionMetadata,
  ChatEvent,
} from '@markprompt/core/chat';
import type {
  SubmitFeedbackOptions,
  PromptFeedback,
} from '@markprompt/core/feedback';
import type {
  AlgoliaDocSearchHit,
  SearchResult,
  SubmitSearchQueryOptions,
} from '@markprompt/core/search';
import type { FileSectionReference } from '@markprompt/core/types';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
  PropsWithChildren,
  ReactNode,
  JSX,
} from 'react';

interface AsProp<C extends ElementType> {
  as?: C;
}

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// This is the first reusable type utility we built
export type PolymorphicComponentProp<
  C extends ElementType,
  // biome-ignore lint/complexity/noBannedTypes: mirroring React types
  Props = {},
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// This is a new type utility with ref!
export type PolymorphicComponentPropWithRef<
  C extends ElementType,
  // biome-ignore lint/complexity/noBannedTypes: mirroring React types
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// This is the type for the "ref" only
export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>['ref'];

export type View = 'chat' | 'search' | 'ticket' | 'menu';

export type TicketDeflectionFormView = 'chat' | 'ticket';

export interface ViewOptions {
  ticketDeflectionFormOptions?: {
    defaultView: TicketDeflectionFormView;
    showBackLink?: boolean;
    threadId?: string;
  };
}

export interface SectionHeading {
  value?: string | undefined;
  id?: string | undefined;
  slug?: string | undefined;
}

export interface SearchResultComponentProps {
  /**
   * Link to the search result.
   */
  href?: string;
  /**
   * Search result item heading.
   */
  heading?: string;
  /**
   * Search result item title.
   */
  title?: string;
  /**
   * Search result item subtitle.
   */
  subtitle?: string;
  /**
   * Source of the search result item.
   */
  source?: {
    /**
     * Source id.
     */
    id?: string;
  };
}

export interface DefaultViewProps {
  /**
   * A greeting message.
   */
  message?: string | ComponentType;
  /**
   * Heading for the default prompts list.
   */
  promptsHeading?: string;
  /**
   * A list of prompt suggestions.
   */
  prompts?: string[];
}

export interface DisclaimerViewProps {
  /**
   * A disclaimer message.
   */
  message: string | ComponentType;
  /**
   * The diclaimer CTA.
   * @default "I agree"
   */
  cta?: string;
}

export interface DefaultSearchViewProps {
  /**
   * Heading for the search results.
   */
  searchesHeading?: string;
  /**
   * Search results view props.
   */
  searches?: SearchResultComponentProps[];
}

export interface CloseOptions {
  /**
   * `aria-label` for the close modal button.
   * @default "Close Markprompt"
   **/
  label?: string;
  /**
   * Show the close button
   * @default true
   **/
  visible?: boolean;
  /**
   * Show an × icon in the close button instead of the keyboard
   * shortcut ('Esc').
   * @default true
   */
  hasIcon?: boolean;
}

export interface DescriptionOptions {
  /**
   * Visually hide the description
   * @default true
   **/
  hide?: boolean;
  /**
   * Description text
   **/
  text?: string;
}

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ChatViewMessageInternalProperties
  extends Omit<ChatCompletionMetadata, 'threadId'> {
  /**
   * Message id.
   */
  id: ReturnType<typeof crypto.randomUUID>;
  /**
   * The loading state.
   */
  state: ChatLoadingState;
  /**
   * Message name.
   */
  name?: string;
  /**
   * Error associated to the message.
   */
  error?: Error;
  /**
   * Chat events associated to the message.
   */
  events?: ChatEvent[];
}

export type ChatViewAssistantMessage = ChatCompletionAssistantMessageParam &
  ChatViewMessageInternalProperties;
export type ChatViewSystemMessage = ChatCompletionSystemMessageParam &
  ChatViewMessageInternalProperties;
export type ChatViewToolMessage = ChatCompletionToolMessageParam &
  ChatViewMessageInternalProperties;
export type ChatViewUserMessage = ChatCompletionUserMessageParam &
  ChatViewMessageInternalProperties;

export type ChatViewMessage =
  | ChatViewAssistantMessage
  | ChatViewSystemMessage
  | ChatViewToolMessage
  | ChatViewUserMessage;

export interface FeedbackOptions {
  /**
   * Enable feedback functionality, shows a thumbs up/down button after a
   * prompt was submitted.
   * @default false
   * */
  enabled?: boolean;
  /**
   * Enable votes.
   * @default true
   * */
  votes?: boolean;
  /**
   * Enable thread CSAT.
   * @default true
   * */
  csat?: boolean;
  /**
   * Enable thread CSAT reason.
   * @default false
   * */
  csatReason?: boolean;
  /**
   * Heading above the form.
   * @default "Was this response helpful?"
   **/
  heading?: string;
  /**
   * Heading above the CSAT picker.
   * @default "How helpful was this?"
   **/
  headingCSAT?: string;
  /**
   * Heading above the CSAT reason input field.
   * @default "Could you tell us more?"
   **/
  headingCSATReason?: string;
  /**
   * Heading above the CSAT reason input field when the user
   * has submitted a reason.
   * @default "Thank you!"
   **/
  thankYouCSATReason?: string;
  /**
   * Called when feedback is submitted.
   * @default undefined
   */
  onFeedbackSubmit?: (
    feedback: PromptFeedback,
    messages: ChatViewMessage[],
    messageId?: string,
  ) => void;
}

export interface AvatarsOptions {
  /**
   * If true, show avatars.
   * @default true
   */
  visible?: boolean;
  /**
   * The user avatar. Can be a string (to use as source for
   * the image) or a component.
   */
  user?: string | ComponentType<{ className: string }>;
  /**
   * The assistant avatar. Can be a string (to use as source for
   * the image) or a component.
   */
  assistant?: string | ComponentType<{ className: string }>;
}

export type ButtonTheme = 'purple';

export type MenuIconId =
  | 'book'
  | 'chat'
  | 'discord'
  | 'magnifying-glass'
  | 'newspaper'
  | 'sparkles';

export type MenuAction = 'chat' | 'ticket' | 'search';

export interface MenuItemProps {
  /**
   * Entry title
   **/
  title: string;
  /**
   * Entry action
   **/
  action?: MenuAction;
  /**
   * Entry type
   * @default link
   **/
  type?: 'link' | 'button';
  /**
   * Entry href
   **/
  href?: string;
  /**
   * Entry link target
   **/
  target?: string;
  /**
   * Entry icon id
   **/
  iconId?: MenuIconId;
  /**
   * Entry icon
   **/
  iconSrc?: string;
  /**
   * Entry id to pass as `data-id` attribute
   **/
  id?: string;
  /**
   * Theme to pass as `data-theme` attribute
   **/
  theme?: ButtonTheme;
}

export interface MenuSectionProps {
  /**
   * Section heading
   **/
  heading?: string;
  /**
   * Section entries
   **/
  entries: MenuItemProps[];
}

export interface MenuOptions {
  /**
   * Menu title
   **/
  title?: string;
  /**
   * Menu subtitle
   **/
  subtitle?: string;
  /**
   * Menu sections
   **/
  sections?: MenuSectionProps[];
  /**
   * Menu footer
   **/
  footer?: MenuItemProps[];
}

export interface ChatOptions {
  /**
   * Show a chat-like interface.
   * @default true
   **/
  enabled?: boolean;
  /**
   * Label for the chat input
   * @default "Ask AI"
   **/
  label?: string;
  /**
   * Title for the standalone chat view
   * @default "Help"
   **/
  title?: string;
  /**
   * Label for the tab bar
   * @default "Ask AI"
   **/
  tabLabel?: string;
  /**
   * Placeholder for the chat input
   * @default "Ask AI…"
   **/
  placeholder?: string;
  /**
   * Label for the submit button
   * @default "Send"
   **/
  buttonLabel?: string;
  /**
   * Component to render when an error occurs in prompt view
   */
  errorText?: ComponentType<{ error: Error }>;
  /**
   * Show copy response button
   * @default true
   **/
  showCopy?: boolean;
  /**
   * Enable chat history features
   * - enable saving chat history to local storage
   * - show chat history UI
   * - resume chat conversations
   * @default true
   */
  history?: boolean;
  /**
   * How many threads to keep in chat history.
   * @default undefined
   * @example 100
   */
  maxHistorySize?: number;
  /**
   * Default (empty) view
   */
  defaultView?: DefaultViewProps;
  /**
   * Disclaimer view
   */
  disclaimerView?: DisclaimerViewProps;
  /**
   * Avatars to use for chat messages.
   */
  avatars?: AvatarsOptions;
}

export interface CreateTicketIntegrationChatOptions {
  /**
   * Title for the view
   * @default "Help"
   **/
  title?: string;
  /**
   * Subtitle for the view
   **/
  subtitle?: string;
  /**
   * Placeholder for the chat input
   * @default "I am having trouble with…"
   **/
  placeholder?: string | string[];
  /**
   * Disclaimer view
   */
  disclaimerView?: DisclaimerViewProps;
  /**
   * Open ticket form label
   * @default "Create case"
   */
  openTicketFormLabel?: string;
  /**
   * Open ticket form loading label
   * @default "Creating case…"
   */
  openTicketFormLoading?: string;
  /**
   * Label for the submit button
   * @default "Send"
   **/
  buttonLabel?: string;
}

export interface ReferencesOptions {
  /**
   * Display mode for the references. References can either be
   * displayed after the response or not displayed at all.
   * @default 'end'
   * */
  display?: 'none' | 'end';
  /** Callback to transform a reference into an href */
  getHref?: (reference: FileSectionReference) => string | undefined;
  /** Callback to transform a reference into a label */
  getLabel?: (reference: FileSectionReference) => string | undefined;
  /**
   * Callback to filter references. If filter returns false, the reference is not displayed.
   * If filter is not defined, all references are displayed.
   * @default undefined
   **/
  filter?: (reference: FileSectionReference) => boolean;
  /**
   * Heading above the references
   * @default "Related articles"
   **/
  heading?: string;
  /** Loading text, default: `Fetching context…` */
  loadingText?: string;
  /**
   * Callback to transform a reference id into an href and text
   * @deprecated Use `getHref` and `getLabel` instead
   **/
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
}

export interface SearchOptions {
  /**
   * Enable search
   * @default false
   **/
  enabled?: boolean;
  /** Callback to transform a search result into an href */
  getHref?: (
    reference: SearchResult | AlgoliaDocSearchHit,
  ) => string | undefined;
  /** Callback to transform a search result into a heading */
  getHeading?: (
    reference: SearchResult | AlgoliaDocSearchHit,
    query: string,
  ) => string | undefined;
  /** Callback to transform a search result into a title */
  getTitle?: (
    reference: SearchResult | AlgoliaDocSearchHit,
    query: string,
  ) => string | undefined;
  /** Callback to transform a search result into a subtitle */
  getSubtitle?: (
    reference: SearchResult | AlgoliaDocSearchHit,
    query: string,
  ) => string | undefined;
  /**
   * Label for the search input, not shown but used for `aria-label`
   * @default "Search documentation"
   **/
  label?: string;
  /**
   * Label for the "Ask AI" link when using "input" layout
   * @default "Ask AI"
   **/
  askLabel?: string;
  /**
   * Default (empty) view
   */
  defaultView?: DefaultSearchViewProps;
  /**
   * Label for the tab bar
   * @default "Search"
   **/
  tabLabel?: string;
  /**
   * Placeholder for the search input
   * @default "Search documentation"
   */
  placeholder?: string;
}

export interface TriggerOptions {
  /**
   * `aria-label` for the open button
   * @default "Ask AI"
   **/
  label?: string;
  /**
   * Label for the open button
   **/
  buttonLabel?: string;
  /**
   * Placeholder text for non-floating element.
   * @default "Ask AI"
   **/
  placeholder?: string;
  /**
   * Should the trigger button be displayed as a floating button at the bottom right of the page?
   * Setting this to false will display a trigger button in the element passed
   * to the `markprompt` function.
   */
  floating?: boolean;
  /** Do you use a custom element as the dialog trigger? */
  customElement?: ReactNode;
  /**
   * Custom image icon source for the open button
   **/
  iconSrc?: string;
}

export interface TitleOptions {
  /**
   * Visually hide the title.
   * @default true
   **/
  hide?: boolean;
  /**
   * Text for the title.
   * @default "Ask AI"
   **/
  text?: string;
}

export interface BrandingOptions {
  /**
   * Show branding.
   * @default true
   **/
  show?: boolean;
  /**
   * Branding display type.
   * @default true
   **/
  type?: 'plain' | 'text';
}

export interface CreateTicketIntegrationMessageButtonOptions {
  /**
   * Button text shown at the end of a message
   * @default "Create a support case"
   */
  text?: string;
  /**
   * Show icon?
   * @default true
   */
  hasIcon?: boolean;
  /**
   * Show text?
   * @default true
   */
  hasText?: boolean;
}

export interface CustomFieldOption {
  /**
   * The displayed label for this custom field option
   */
  label: string;
  /**
   * The value of the custom field that will be sent to the service provider
   */
  value: string;
}

export interface CustomFieldOptionGroup {
  /**
   * Options group label
   */
  label: string;

  /**
   * Grouped options
   */
  items: CustomFieldOption[];
}

export interface CustomField {
  /**
   * The displayed label for this custom field
   */
  label: string;
  /**
   * The custom field id.
   */
  id: string;
  /**
   * Options for this custom field
   */
  items: (CustomFieldOptionGroup | CustomFieldOption)[];
}

export interface CreateTicketIntegrationFormOptions {
  /**
   * Label for the name input
   * @default "Your Name"
   */
  nameLabel: string;
  /**
   * Placeholder for the name input
   */
  namePlaceholder: string;
  /**
   * Label for the email input
   * @default "Email"
   */
  emailLabel: string;
  /**
   * Placeholder for the email input
   * */
  emailPlaceholder: string;
  /**
   * Label for the subject input
   * @default "Subject"
   */
  subjectLabel: string;
  /**
   * Placeholder for the subject input
   * @default ""
   */
  subjectPlaceholder: string;
  /**
   * Label for the summary input
   * @default "How can we help?"
   */
  summaryLabel: string;
  /**
   * Placeholder for the summary input
   * @default "Please describe your issue"
   */
  summaryPlaceholder: string;
  /**
   * Loading text for the summary input
   * @default "Generating summary…"
   */
  summaryLoading: string;
  /**
   * Should the form include a file attachment input, allowing users to upload files (eg. screenshots, log files, etc)?
   * @default false;
   */
  hasFileUploadInput: boolean;
  /**
   * File attachment label
   * @default "Attach a file"
   */
  uploadFileLabel: string;
  /**
   * Label for the submit button
   * @default "Submit case"
   */
  submitLabel: string;
  /**
   * Text shown when the ticket was created ok
   * @default "Thank you! We will get back to you shortly."
   */
  ticketCreatedOk: string;
  /**
   * Text shown when the ticket creation failed
   * @default "An error occurred while creating the case"
   */
  ticketCreatedError: string;
  /**
   * Text shown when the files added are too large (in total)
   * @default "Total file size is too large to upload. Maximum allowed size is 4.5MB."
   */
  maxFileSizeError: string;
  /**
   * Custom fields
   * @see https://developer.zendesk.com/documentation/ticketing/managing-tickets/creating-and-updating-tickets/#setting-custom-field-values
   * @default undefined;
   */
  customFields?: CustomField[];
}

export interface CreateTicketIntegrationUserOptions {
  /**
   * The user's name
   **/
  name?: string;
  /**
   * The user's email
   **/
  email?: string;
}

export interface CreateTicketIntegrationOptions {
  /**
   * Enable the create ticket feature
   * @default false
   **/
  enabled: boolean;
  /**
   * The provider to use for creating tickets.
   **/
  provider: 'salesforce' | 'zendesk';
  /**
   * The prompt to use to create a summary of the conversation between user and bot for the support agent
   **/
  prompt?: string;
  /**
   * Default text shown at the end of a chat message.
   * @default "Need more help?"
   */
  messageText?: string;
  /**
   * Options for the button shown at the end of a chat message.
   */
  messageButton?: CreateTicketIntegrationMessageButtonOptions;
  /**
   * Options for the create ticket form.
   */
  form?: CreateTicketIntegrationFormOptions;
  /**
   * Provide a custom case form component
   */
  CustomCaseForm?: ComponentType<{
    summaryData?: { subject: string; body: string };
  }>;
  /**
   * Options for the create ticket chat.
   */
  chat?: CreateTicketIntegrationChatOptions;
  /**
   * User options
   */
  user?: CreateTicketIntegrationUserOptions;
}

export interface IntegrationsOptions {
  /**
   * Allow users to create tickets in a support system from the chat.
   * @default undefined
   */
  createTicket?: CreateTicketIntegrationOptions;
}

export interface ToolCall {
  status: 'loading' | 'done' | 'error';
  error?: string;
  result?: string;
}

export interface ConfirmationProps {
  /**
   * Tool calls as returned by the model
   */
  toolCalls: ChatCompletionMessageToolCall[];
  /**
   * Status and results of tool calls
   */
  toolCallsStatus: { [key: string]: ToolCall };
  /**
   * Tools as provided by the user
   */
  tools?: ChatViewTool[];
  confirmToolCalls: () => void;
}

export interface ChatViewTool {
  /**
   * OpenAI tool definition.
   */
  tool: ChatCompletionTool;
  /**
   * The actual function to call. Called with a JSON string as returned from
   * OpenAI. Should validate the JSON for correctness as OpenAI can hallucinate
   * arguments. Must return a string to feed the result back into OpenAI.
   **/
  call: (args: string, context?: { threadId: string }) => Promise<string>;
  /**
   * Whether user needs to confirm a call to this function or function calls
   * will be executed right away.
   * @default true
   */
  requireConfirmation?: boolean;
  /**
   * If true, show a message when the tool is automatically triggered.
   * @default true
   */
  showDefaultAutoTriggerMessage?: boolean;
}

export interface ToolsOptions {
  /**
   * A list of tool definitions.
   */
  tools?: ChatViewTool[];
  /**
   * An optional user-provided confirmation message component that takes the
   * tool calls provided by OpenAI and a confirm function that should be called
   * when the user confirms the tool calls.
   */
  ToolCallsConfirmation?: (props: ConfirmationProps) => JSX.Element;
}

export type UserConfigurableOptions = Omit<
  SubmitChatOptions,
  'signal' | 'tools'
> &
  ToolsOptions;

export type MarkpromptDisplay = 'plain' | 'dialog' | 'sheet';

export interface MarkpromptOptions {
  /**
   * The base API URL.
   * @default "https://api.markprompt.com"
   */
  apiUrl?: string;
  /**
   * Headers to pass along the request.
   * @default undefined
   */
  headers?: { [key: string]: string };
  /**
   * Trigger component, such as a search button or a floating chat bubble.
   * @default undefined
   **/
  children?: ReactNode;
  /**
   * The way to display the chat/search content.
   * @default "sheet"
   **/
  display?: MarkpromptDisplay;
  /**
   * Enable user interactions outside of the dialog while keeping it open.
   * @default false
   **/
  sticky?: boolean;
  /**
   * The default view to show when both chat and search are enabled.
   * @default "search"
   * */
  defaultView?: View;
  /**
   * Multi-pane layout when both search and chat are enabled.
   * @default "panels"
   **/
  layout?: 'panels' | 'tabs';
  /**
   * Options for the menu component.
   */
  menu?: MenuOptions;
  /**
   * Options for the chat component.
   */
  chat?: UserConfigurableOptions & ChatOptions;
  /**
   * Options for the search component.
   */
  search?: SubmitSearchQueryOptions & SearchOptions;
  /**
   * Options for the feedback component.
   **/
  feedback?: SubmitFeedbackOptions & FeedbackOptions;
  /**
   * Options for the references component.
   */
  references?: ReferencesOptions;
  /**
   * Options for integrations.
   */
  integrations?: IntegrationsOptions;
  /**
   * Options for the trigger component.
   */
  trigger?: TriggerOptions;
  /**
   * Options for the close button.
   **/
  close?: CloseOptions;
  /**
   * Options for the description.
   **/
  description?: DescriptionOptions;
  /**
   * Options for the title component.
   */
  title?: TitleOptions;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: ElementType<{ href?: string }>;
  /**
   * Options for the title component.
   * @default true
   * @deprecated Use `branding` instead
   **/
  showBranding?: boolean;
  /**
   * Options for the title component.
   **/
  branding?: BrandingOptions;
  /**
   * Display debug info.
   * @default false
   **/
  debug?: boolean;
}
