---
'@markprompt/web': minor
---

# Reuse `@markprompt/react` components in `@markprompt/web`

In order to avoid duplicate effort, we are now publishing `@markprompt/web` as a composition of `@markprompt/react` components, rather than as a separate implementation in Lit Web Components.

We expose a `markprompt()` function from `@markprompt/web` that allows you to initialize a pre-built version of the Markprompt dialog with all functionality included.

## Usage

### From JavaScript

#### Install

```sh
npm install @markprompt/web @markprompt/css
```

#### Use

```js
import '@markprompt/css';
import { markprompt } from '@markprompt/web';

markprompt(`<your-project-key>`, `#markprompt`);
```

### Via script tag

As an alternative, we expose an init script that you can use to initialize Markprompt with a script tag.

```html
<head>
  <link rel="stylesheet" href="https://esm.sh/@markprompt/css?css" />
  <script>
    window.markprompt = {
      projectKey: `<your-project-key>`,
      container: `#markprompt`,
    };
  </script>
  <script async src="https://esm.sh/@markprompt/web/init"></script>
</head>
```
