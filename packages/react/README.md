# Markprompt React

The [Markprompt](https://markprompt.com) React component is a headless component that offers you a simple, accessible and fully customizable way to add a prompt UI to your React applications. It is based off of [Radix UI's](https://www.radix-ui.com/) [Dialog component](https://www.radix-ui.com/docs/primitives/components/dialog), and presents a similar API.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/react">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/react">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/react/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/react">
  </a>
</p>

## Installation

Install the `@markprompt/react` package via NPM or Yarn:

```sh
# NPM
npm install @markprompt/react
# Yarn
yarn add @markprompt/react
```

## Usage

Example:

```jsx
import { Markprompt } from '@markprompt/react';
import { ChatIcon, CloseIcon, SearchIcon, Caret } from './icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useContext } from 'react';

function Component() {
  return (
    <Markprompt.Root projectKey="<your-markprompt-project-key>">
      <Markprompt.DialogTrigger
        aria-label="Open Markprompt"
        className="MarkpromptButton"
      >
        <ChatIcon className="MarkpromptIcon" />
      </Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay className="MarkpromptOverlay" />
        <Markprompt.Content className="MarkpromptContent">
          <Markprompt.Close className="MarkpromptClose">
            <CloseIcon />
          </Markprompt.Close>

          {/* Markprompt.Title is required for accessibility reasons. It can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Title>
              Ask me anything about Markprompt
            </Markprompt.Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons. It is optional and can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Description>
              I can answer your questions about Markprompt's client-side
              libraries, onboarding, API's and more.
            </Markprompt.Description>
          </VisuallyHidden>

          <Markprompt.Form>
            <SearchIcon className="MarkpromptSearchIcon" />
            <Markprompt.Prompt
              className="MarkpromptPrompt"
              placeholder="Ask me anything…"
            />
          </Markprompt.Form>

          <Markprompt.AutoScroller className="MarkpromptAnswer">
            <Caret />
            <Markprompt.Answer />
          </Markprompt.AutoScroller>

          <References />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>
  );
}

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

const Reference = ({
  referenceId,
  index,
}: {
  referenceId: string,
  index: number,
}) => {
  return (
    <li
      key={referenceId}
      className="reference"
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <a href={removeFileExtension(referenceId)}>
        {capitalize(removeFileExtension(referenceId.split('/').slice(-1)[0]))}
      </a>
    </li>
  );
};

const References = () => {
  const { state, references } = useContext(Markprompt.Context);

  if (state === 'indeterminate') return null;

  let adjustedState: string = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  return (
    <div data-loading-state={adjustedState} className={styles.references}>
      <div className={styles.progress} />
      <p>Fetching relevant pages…</p>
      <p>Answer generated from the following sources:</p>
      <Markprompt.References RootElement="ul" ReferenceElement={Reference} />
    </div>
  );
};
```

replacing `<projectKey>` with the key associated to your project. It can be obtained in the project settings under "Project key".

## API

### `<Answer />`

Render the markdown answer from the Markprompt API. It accepts the same props as [`react-markdown`](https://github.com/remarkjs/react-markdown#props), except `children`.

### `<AutoScroller />`

A component automatically that scrolls to the bottom. It accepts the following props:

- `autoScroll` (`boolean`): Whether or not to enable automatic scrolling. (Default: `true`)
- `scrollBehaviour` (`string`): The behaviour to use for scrolling. (Default: `smooth`)

All other props will be passed to the underlying `<div>` element.

### `<Close />`

A button to close the Markprompt dialog and abort an ongoing request. It accepts the same props as [Radix UI `Dialog.Close`](https://www.radix-ui.com/docs/primitives/components/dialog#close).

### `<Content />`

The Markprompt dialog content. It accepts the same props as [Radix UI `Dialog.Content`](https://www.radix-ui.com/docs/primitives/components/dialog#content), with the following additional prop:

- `showBranding` (`boolean`): Show the Markprompt footer.

### `<Description />`

A visually hidden aria description. It accepts the same props as [Radix UI `Dialog.Description`](https://www.radix-ui.com/docs/primitives/components/dialog#description), with the following additional prop:

- `hide` (`boolean`): Hide the description.

### `<Form />`

A form which, when submitted, submits the current prompt. It accepts the same props as `<form>`.

### `<Overlay />`

The Markprompt dialog overlay. It accepts the same props as [Radix UI `Dialog.Overlay`](https://www.radix-ui.com/docs/primitives/components/dialog#overlay).

### `<Portal />`

The Markprompt dialog portal. It accepts the same props as [Radix UI `Dialog.Portal`](https://www.radix-ui.com/docs/primitives/components/dialog#portal).

### `<Prompt />`

The Markprompt input prompt. User input will update the prompt in the Markprompt context. It accepts the following props:

- `label` (`ReactNode`): The label for the input.
- `labelClassName` (`string`): The class name of the label element.

### `<References />`

Render the references that Markprompt returns. It accepts the following props:

- `RootComponent` (`Component`): The wrapper component to render. (Default: `'ul'`)
- `ReferenceComponent` (`Component`): The component to render for each reference. (Default: '`li`')

### `<Root />`

The Markprompt context provider and dialog root. It accepts the [Radix UI `Dialog.Root`](https://www.radix-ui.com/docs/primitives/components/dialog#root) props and the `useMarkprompt`options as props.

### `<Title />`

A visually hidden aria title. It accepts the same props as [Radix UI `Dialog.Title`](https://www.radix-ui.com/docs/primitives/components/dialog#title), with the following additional prop:

- `hide` (`boolean`): Hide the title.

### `<Trigger />`

A button to open the Markprompt dialog. It accepts the same props as [Radix UI `Dialog.Trigger`](https://www.radix-ui.com/docs/primitives/components/dialog#trigger).

### `useMarkprompt(options)`

Create an interactive stateful Markprompt prompt. It takes the same options as [`submitPrompt()`](https://github.com/motifland/markprompt-js/tree/main/packages/core#options), and the project key.

## Documentation

The full documentation for the component can be found on the [Markprompt docs](https://markprompt.com/docs#react).

## Starter Template

For a working setup based on Next.js + Tailwind, check out the [Markprompt starter template](https://github.com/motifland/markprompt-starter-template).

## Community

- [Twitter](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).

## License

[MIT](./LICENSE) © [Motif](https://motif.land)
