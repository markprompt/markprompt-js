# @markprompt/react

## 0.10.1

### Patch Changes

- [#57](https://github.com/motifland/markprompt-js/pull/57) [`cb917ff`](https://github.com/motifland/markprompt-js/commit/cb917ff237f5dab6ed75eb9ac90e87f985562cf0) Thanks [@michaelfester](https://github.com/michaelfester)! - CSS fixes for dark mode, handle focus state for Ask AI button

## 0.10.0

### Minor Changes

- [#55](https://github.com/motifland/markprompt-js/pull/55) [`c396109`](https://github.com/motifland/markprompt-js/commit/c3961092a1a5f34173274990d1e90d3216d2fde0) Thanks [@michaelfester](https://github.com/michaelfester)! - Revert to React 17

## 0.9.0

### Minor Changes

- [#53](https://github.com/motifland/markprompt-js/pull/53) [`9f6fe21`](https://github.com/motifland/markprompt-js/commit/9f6fe213c1de9e3e1c8c5750c6a02d0bb8b1b3cb) Thanks [@michaelfester](https://github.com/michaelfester)! - Upgrade to React 18

## 0.8.0

### Minor Changes

- [#50](https://github.com/motifland/markprompt-js/pull/50) [`b562aa4`](https://github.com/motifland/markprompt-js/commit/b562aa4e8a2b181596a0ead6867e5d820efe9cd4) Thanks [@nickrttn](https://github.com/nickrttn)! - Add functionality to use a custom trigger for Markprompt

### Patch Changes

- Updated dependencies [[`642e3a1`](https://github.com/motifland/markprompt-js/commit/642e3a1fecb4d09e9b0269a5009b0a2952880e3a)]:
  - @markprompt/core@0.6.0

## 0.7.0

### Minor Changes

- [#49](https://github.com/motifland/markprompt-js/pull/49) [`54af915`](https://github.com/motifland/markprompt-js/commit/54af9150ea22da96ec4cf3d283d6d8a485696a06) Thanks [@michaelfester](https://github.com/michaelfester)! - Move the Markprompt component from @markprompt/web to @markprompt/react, allowing React and Docusaurus users to use the prebuilt component

## 0.6.0

### Minor Changes

- [#42](https://github.com/motifland/markprompt-js/pull/42) [`210cf40`](https://github.com/motifland/markprompt-js/commit/210cf40dc66bb720af44eac14bc26d075c3042bd) Thanks [@nickrttn](https://github.com/nickrttn)! - Update types and the way options are passed, fix a bug where a search result was clicked when Cmd/Ctrl+Enter was pressed instead of navigating to the Prompt view

## 0.5.0

### Minor Changes

- [#31](https://github.com/motifland/markprompt-js/pull/31) [`df37791`](https://github.com/motifland/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e) Thanks [@nickrttn](https://github.com/nickrttn)! - Add search functionality to Markprompt

### Patch Changes

- [#40](https://github.com/motifland/markprompt-js/pull/40) [`c772430`](https://github.com/motifland/markprompt-js/commit/c77243035121001d544dd061d86835a424b2adb2) Thanks [@remcohaszing](https://github.com/remcohaszing)! - Define explicit return types

- Updated dependencies [[`df37791`](https://github.com/motifland/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e), [`c772430`](https://github.com/motifland/markprompt-js/commit/c77243035121001d544dd061d86835a424b2adb2)]:
  - @markprompt/core@0.5.0

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
