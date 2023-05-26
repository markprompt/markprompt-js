---
'@markprompt/web': minor
---

In order to avoid duplicate effort, we are now publishing `@markprompt/web` as a composition of `@markprompt/react` components, rather than as a separate implementation in Lit Web Components.

We expose a `markprompt()` function from `@markprompt/web` that allows you to initialize a pre-built version of the Markprompt dialog with all functionality included.

As an alternative, we expose an init script at `@markprompt/web/init` that you can use to initialize Markprompt with a script tag.
