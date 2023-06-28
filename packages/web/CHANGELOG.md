# @markprompt/web

## 0.8.2

### Patch Changes

- Updated dependencies [[`c396109`](https://github.com/motifland/markprompt-js/commit/c3961092a1a5f34173274990d1e90d3216d2fde0)]:
  - @markprompt/react@0.10.0

## 0.8.1

### Patch Changes

- Updated dependencies [[`9f6fe21`](https://github.com/motifland/markprompt-js/commit/9f6fe213c1de9e3e1c8c5750c6a02d0bb8b1b3cb)]:
  - @markprompt/react@0.9.0

## 0.8.0

### Minor Changes

- [#50](https://github.com/motifland/markprompt-js/pull/50) [`b562aa4`](https://github.com/motifland/markprompt-js/commit/b562aa4e8a2b181596a0ead6867e5d820efe9cd4) Thanks [@nickrttn](https://github.com/nickrttn)! - Add functionality to use a custom trigger for Markprompt

### Patch Changes

- Updated dependencies [[`b562aa4`](https://github.com/motifland/markprompt-js/commit/b562aa4e8a2b181596a0ead6867e5d820efe9cd4), [`642e3a1`](https://github.com/motifland/markprompt-js/commit/642e3a1fecb4d09e9b0269a5009b0a2952880e3a)]:
  - @markprompt/react@0.8.0
  - @markprompt/core@0.6.0

## 0.7.0

### Minor Changes

- [#45](https://github.com/motifland/markprompt-js/pull/45) [`b607149`](https://github.com/motifland/markprompt-js/commit/b60714904c2481da40801e16acc2a3c4b0717f85) Thanks [@michaelfester](https://github.com/michaelfester)! - Move References height animations to JS so we can avoid specifying static heights in CSS

- [#49](https://github.com/motifland/markprompt-js/pull/49) [`54af915`](https://github.com/motifland/markprompt-js/commit/54af9150ea22da96ec4cf3d283d6d8a485696a06) Thanks [@michaelfester](https://github.com/michaelfester)! - Move the Markprompt component from @markprompt/web to @markprompt/react, allowing React and Docusaurus users to use the prebuilt component

### Patch Changes

- Updated dependencies [[`54af915`](https://github.com/motifland/markprompt-js/commit/54af9150ea22da96ec4cf3d283d6d8a485696a06)]:
  - @markprompt/react@0.7.0

## 0.6.0

### Minor Changes

- [#42](https://github.com/motifland/markprompt-js/pull/42) [`210cf40`](https://github.com/motifland/markprompt-js/commit/210cf40dc66bb720af44eac14bc26d075c3042bd) Thanks [@nickrttn](https://github.com/nickrttn)! - Add a new type of trigger that has the appearance of a search input, update types and the way that we pass options into Markprompt.Root

## 0.5.0

### Minor Changes

- [#31](https://github.com/motifland/markprompt-js/pull/31) [`df37791`](https://github.com/motifland/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e) Thanks [@nickrttn](https://github.com/nickrttn)! - Add search functionality to Markprompt

### Patch Changes

- [#34](https://github.com/motifland/markprompt-js/pull/34) [`8eb9d01`](https://github.com/motifland/markprompt-js/commit/8eb9d01253ec624338cb16523bd5585ef1f9e203) Thanks [@nickrttn](https://github.com/nickrttn)! - Update README

- [#40](https://github.com/motifland/markprompt-js/pull/40) [`c772430`](https://github.com/motifland/markprompt-js/commit/c77243035121001d544dd061d86835a424b2adb2) Thanks [@remcohaszing](https://github.com/remcohaszing)! - Define explicit return types

- Updated dependencies [[`df37791`](https://github.com/motifland/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e), [`c772430`](https://github.com/motifland/markprompt-js/commit/c77243035121001d544dd061d86835a424b2adb2)]:
  - @markprompt/core@0.5.0

## 0.4.1

### Patch Changes

- [`7bf343f`](https://github.com/motifland/markprompt-js/commit/7bf343ffeeb138196a1028d83d56876fa2cd272f) Thanks [@nickrttn](https://github.com/nickrttn)! - Update README

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
