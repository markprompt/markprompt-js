# @markprompt/react

## 0.4.0

### Minor Changes

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Call user provided event handlers in components where we call event handlers ourselves

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `forwardRef` to headless components where possible

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Specify props passed to DOM elements as defaults, making them overridable by users

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Remove unused options from `useMarkprompt`

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `hide` prop to `Markprompt.Title` and `Markprompt.Description` that allows you to accessibly hide the components

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `autoScroll` prop to `Markprompt.AutoScroller`

- [`ca1282e`](https://github.com/motifland/markprompt-js/commit/ca1282e3b2805e2ad283e8f4ed3841c96de69044) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `main` field to `package.json`

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `showBranding` prop to `Markprompt.Content`

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add a `useMarkpromptContext` hook for use in headless component compositions

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `scrollBehavior` prop to `Markprompt.AutoScroller`

### Patch Changes

- [#26](https://github.com/motifland/markprompt-js/pull/26) [`076b856`](https://github.com/motifland/markprompt-js/commit/076b8565efae46012cb9657b8556772713665199) Thanks [@nickrttn](https://github.com/nickrttn)! - Upgrade dependencies

- Updated dependencies [[`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9)]:
  - @markprompt/core@0.4.6

## 0.3.2

### Patch Changes

- [#12](https://github.com/motifland/markprompt-js/pull/12) [`e169b5e`](https://github.com/motifland/markprompt-js/commit/e169b5ed758b56cec48fe4e26e7e50f5c62d3b70) Thanks [@remcohaszing](https://github.com/remcohaszing)! - Use star import for @radix-ui/react-dialog

  `@radix-ui/react-dialog` is [packaged incorrectly](https://github.com/radix-ui/primitives/issues/1848). Because of this, some
  tools (Next.js) must use a default import to import it, whereas others
  (Vite, Docusaurus) must use a star import. Since our demos use Vite and
  Docusaurus, let’s go with star imports.
