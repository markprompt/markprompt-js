# @markprompt/web

## 0.4.0

### Minor Changes

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - In order to avoid duplicate effort, we are now publishing `@markprompt/web` as a composition of `@markprompt/react` components, rather than as a separate implementation in Lit Web Components.

  We expose a `markprompt()` function from `@markprompt/web` that allows you to initialize a pre-built version of the Markprompt dialog with all functionality included.

  As an alternative, we expose an init script at `@markprompt/web/init` that you can use to initialize Markprompt with a script tag.

### Patch Changes

- [#26](https://github.com/motifland/markprompt-js/pull/26) [`076b856`](https://github.com/motifland/markprompt-js/commit/076b8565efae46012cb9657b8556772713665199) Thanks [@nickrttn](https://github.com/nickrttn)! - Upgrade dependencies

- [`538f569`](https://github.com/motifland/markprompt-js/commit/538f569020f4e8a85009c3e63fbab6ec70576b2d) Thanks [@nickrttn](https://github.com/nickrttn)! - Move ambient types to init.ts

- Updated dependencies [[`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9)]:
  - @markprompt/core@0.4.6
