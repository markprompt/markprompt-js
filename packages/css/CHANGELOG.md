# @markprompt/css

## 0.32.3

### Patch Changes

- [`9d57632`](https://github.com/markprompt/markprompt-js/commit/9d576327a3b0bb9cbc75f309b1bd03944cc7f57c) Thanks [@nickrttn](https://github.com/nickrttn)! - Version bump for botched release

## 0.32.2

### Patch Changes

- [`6bc0132`](https://github.com/markprompt/markprompt-js/commit/6bc01327a6a4510cf9bfb3204f325dc0b9668e2f) Thanks [@nickrttn](https://github.com/nickrttn)! - Add Biome a11y/correctness/complexity formatting and fix errors

## 0.32.1

### Patch Changes

- [#426](https://github.com/markprompt/markprompt-js/pull/426) [`4aced34`](https://github.com/markprompt/markprompt-js/commit/4aced34c13ece1d22eb6e4827a598fd8d2afa53d) Thanks [@nickrttn](https://github.com/nickrttn)! - Remove unused class

- [#428](https://github.com/markprompt/markprompt-js/pull/428) [`a847eeb`](https://github.com/markprompt/markprompt-js/commit/a847eeb1c6d728aa770f663d31df37e82bb5e753) Thanks [@nickrttn](https://github.com/nickrttn)! - Fix formatting using Biome

## 0.32.0

### Minor Changes

- [#419](https://github.com/markprompt/markprompt-js/pull/419) [`08b31ac`](https://github.com/markprompt/markprompt-js/commit/08b31ac4a361c1bddb0b0d2a431fd6f4d46e2dac) Thanks [@michaelfester](https://github.com/michaelfester)! - Add CSAT reason component

## 0.31.5

### Patch Changes

- [#403](https://github.com/markprompt/markprompt-js/pull/403) [`e13e098`](https://github.com/markprompt/markprompt-js/commit/e13e0985d2c285b7908b157f2baa293e1b67bcfc) Thanks [@michaelfester](https://github.com/michaelfester)! - Open ticket creation form from chat

## 0.31.4

### Patch Changes

- [#399](https://github.com/markprompt/markprompt-js/pull/399) [`eee804b`](https://github.com/markprompt/markprompt-js/commit/eee804b2dcf0152daf71fe69677da70c8db46b0d) Thanks [@michaelfester](https://github.com/michaelfester)! - Move image constraints to CSS

## 0.31.3

### Patch Changes

- [#383](https://github.com/markprompt/markprompt-js/pull/383) [`b5e23d0`](https://github.com/markprompt/markprompt-js/commit/b5e23d0f0e15f10797a7caa7ac24805a800c5dc9) Thanks [@nickrttn](https://github.com/nickrttn)! - Update linting setup and fix various linting issues surfaced by the change

## 0.31.2

### Patch Changes

- [#373](https://github.com/markprompt/markprompt-js/pull/373) [`393e80c`](https://github.com/markprompt/markprompt-js/commit/393e80c51f19707090ae5521abfa0e8d07889026) Thanks [@michaelfester](https://github.com/michaelfester)! - Add deprecation flags

## 0.31.1

### Patch Changes

- [`305eac7`](https://github.com/markprompt/markprompt-js/commit/305eac7f82d5af7b14f528497a926347b9819814) Thanks [@nickrttn](https://github.com/nickrttn)! - Fix for publishing releases to GH Releases

## 0.31.0

### Minor Changes

- [`d762155`](https://github.com/markprompt/markprompt-js/commit/d762155c2115060925e1c38f133da20f7b6b4764) Thanks [@nickrttn](https://github.com/nickrttn)! - Add standalone ticket deflection form

## 0.30.1

### Patch Changes

- [#351](https://github.com/markprompt/markprompt-js/pull/351) [`50bc076`](https://github.com/markprompt/markprompt-js/commit/50bc07604267eb3d7e821defa621cd9d428a857e) Thanks [@michaelfester](https://github.com/michaelfester)! - Add store key parameter

## 0.30.0

### Minor Changes

- [#349](https://github.com/markprompt/markprompt-js/pull/349) [`44e7cda`](https://github.com/markprompt/markprompt-js/commit/44e7cda4073bfa96911630080aabc4c988af4dd6) Thanks [@michaelfester](https://github.com/michaelfester)! - Rename conversationId and promptId to threadId and messageId. Improve function calling state management.

## 0.29.0

### Minor Changes

- [#346](https://github.com/markprompt/markprompt-js/pull/346) [`90c8df3`](https://github.com/markprompt/markprompt-js/commit/90c8df3f8dd4346a6286316ee887c9522ab75d0a) Thanks [@nickrttn](https://github.com/nickrttn)! - Add custom fields support for create ticket view

## 0.28.0

### Minor Changes

- [#345](https://github.com/markprompt/markprompt-js/pull/345) [`7509fba`](https://github.com/markprompt/markprompt-js/commit/7509fba9205d204da69731bba0b05e4ed99bfe9b) Thanks [@nickrttn](https://github.com/nickrttn)! - Add file attachment support for create ticket view

  Enable by adding the following option:

  ```jsx
  <Markprompt
    ...
    integrations={{
      createTicket: {
        ...
        form: {
          hasFileUploadInput: true,
        },
      },
    }}
  />
  ```

## 0.27.0

### Minor Changes

- [#342](https://github.com/markprompt/markprompt-js/pull/342) [`e9d3db2`](https://github.com/markprompt/markprompt-js/commit/e9d3db28a0d6faa380d87946fd9ae0ba5e85ea1a) Thanks [@michaelfester](https://github.com/michaelfester)! - New screens

### Patch Changes

- [#342](https://github.com/markprompt/markprompt-js/pull/342) [`e9d3db2`](https://github.com/markprompt/markprompt-js/commit/e9d3db28a0d6faa380d87946fd9ae0ba5e85ea1a) Thanks [@michaelfester](https://github.com/michaelfester)! - Add support for PII flag

## 0.26.2

### Patch Changes

- [#339](https://github.com/markprompt/markprompt-js/pull/339) [`ba0893ee11d7263c22d23d27513c51cd2c34d03b`](https://github.com/markprompt/markprompt-js/commit/ba0893ee11d7263c22d23d27513c51cd2c34d03b) Thanks [@michaelfester](https://github.com/michaelfester)! - Add disclaimer option

## 0.26.1

### Patch Changes

- [#337](https://github.com/markprompt/markprompt-js/pull/337) [`163d05d59e1666de2a9269b65a1eaa579f60afef`](https://github.com/markprompt/markprompt-js/commit/163d05d59e1666de2a9269b65a1eaa579f60afef) Thanks [@michaelfester](https://github.com/michaelfester)! - Add support for PII flag

## 0.26.0

### Minor Changes

- [`cca5b68b4d641448faee82f5edc2bc4f16904648`](https://github.com/markprompt/markprompt-js/commit/cca5b68b4d641448faee82f5edc2bc4f16904648) Thanks [@nickrttn](https://github.com/nickrttn)! - **Breaking change**: Remove all `:where()` clauses.

  Please verify your Markprompt styling carefully after upgrading to this version of `@markprompt/css`.

  ***

  The initial idea with using `:where()` everywhere was to allow users of our CSS library to override the default styles of Markprompt components very easily, as `where()` clauses always have a specificity of 0.

  However, we found that because even something like a global defined style, say `ul { border: green; }` affects our CSS it was almost _too easy_ to override our styles. With that, the ease of overriding our styles was also causing breakage and causing users having to write more custom styles than necessary, or even having to duplicate our styles and remove `:where()` clauses themselves.

  In the end we've decided to remove all `:where()` clauses from our CSS to make it easier for users to work with our CSS in a more familiar way, eg. by overriding a class.

## 0.25.0

### Minor Changes

- [#324](https://github.com/markprompt/markprompt-js/pull/324) [`bcdaa65d5c23b31e58574b7732d6bee4f7aaddf4`](https://github.com/markprompt/markprompt-js/commit/bcdaa65d5c23b31e58574b7732d6bee4f7aaddf4) Thanks [@michaelfester](https://github.com/michaelfester)! - Unnest types

## 0.24.0

### Minor Changes

- [#308](https://github.com/markprompt/markprompt-js/pull/308) [`ce40efcc5d4ae425341b814fcb2ec69732beaa84`](https://github.com/markprompt/markprompt-js/commit/ce40efcc5d4ae425341b814fcb2ec69732beaa84) Thanks [@nickrttn](https://github.com/nickrttn)! - Add an integration that allows users to create Zendesk tickets when the bot did not manage to help them with their question

## 0.23.4

### Patch Changes

- [#320](https://github.com/markprompt/markprompt-js/pull/320) [`89e73e8f7e3ee0c0b560661fcab23808f96c542c`](https://github.com/markprompt/markprompt-js/commit/89e73e8f7e3ee0c0b560661fcab23808f96c542c) Thanks [@michaelfester](https://github.com/michaelfester)! - UI fixes

## 0.23.3

### Patch Changes

- [#314](https://github.com/markprompt/markprompt-js/pull/314) [`48ddc66dc642acca227856519cfbd1bf166df2c4`](https://github.com/markprompt/markprompt-js/commit/48ddc66dc642acca227856519cfbd1bf166df2c4) Thanks [@michaelfester](https://github.com/michaelfester)! - Add showDefaultAutoTriggerMessage

## 0.23.2

### Patch Changes

- [#309](https://github.com/markprompt/markprompt-js/pull/309) [`ad70a09d5a4f04b90314662b982d0466ac5d0dca`](https://github.com/markprompt/markprompt-js/commit/ad70a09d5a4f04b90314662b982d0466ac5d0dca) Thanks [@michaelfester](https://github.com/michaelfester)! - UI fixes

## 0.23.1

### Patch Changes

- [#294](https://github.com/markprompt/markprompt-js/pull/294) [`7a61464707a2eaeccfa728694987276df694c788`](https://github.com/markprompt/markprompt-js/commit/7a61464707a2eaeccfa728694987276df694c788) Thanks [@michaelfester](https://github.com/michaelfester)! - UI fixes

## 0.23.0

### Minor Changes

- [#291](https://github.com/markprompt/markprompt-js/pull/291) [`090d4a4c254ea84747a3ac1caf862ceb5a43e5f3`](https://github.com/markprompt/markprompt-js/commit/090d4a4c254ea84747a3ac1caf862ceb5a43e5f3) Thanks [@michaelfester](https://github.com/michaelfester)! - Add docs

- [#291](https://github.com/markprompt/markprompt-js/pull/291) [`090d4a4c254ea84747a3ac1caf862ceb5a43e5f3`](https://github.com/markprompt/markprompt-js/commit/090d4a4c254ea84747a3ac1caf862ceb5a43e5f3) Thanks [@michaelfester](https://github.com/michaelfester)! - New search view

## 0.22.0

### Minor Changes

- [#283](https://github.com/markprompt/markprompt-js/pull/283) [`1a8cec690be2567846e7c3de7f12af2060e332e9`](https://github.com/markprompt/markprompt-js/commit/1a8cec690be2567846e7c3de7f12af2060e332e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Improve the error view for `PromptView` and `ChatView`

## 0.21.0

### Minor Changes

- [#281](https://github.com/markprompt/markprompt-js/pull/281) [`834a97e672a350ed79bdb66e793bd6bb6c9a5b5c`](https://github.com/markprompt/markprompt-js/commit/834a97e672a350ed79bdb66e793bd6bb6c9a5b5c) Thanks [@nickrttn](https://github.com/nickrttn)! - Upgrade various dependencies

## 0.20.0

### Minor Changes

- [#277](https://github.com/markprompt/markprompt-js/pull/277) [`0d7170d`](https://github.com/markprompt/markprompt-js/commit/0d7170dcb16a8a233c7a5ed3ad5b59065d2e27b6) Thanks [@nickrttn](https://github.com/nickrttn)! - Improve mobile/touch devices design

## 0.19.1

### Patch Changes

- [#257](https://github.com/markprompt/markprompt-js/pull/257) [`011698d`](https://github.com/markprompt/markprompt-js/commit/011698de13d95af7d33b729f853b96049f1cb715) Thanks [@michaelfester](https://github.com/michaelfester)! - Use header version

## 0.19.0

### Minor Changes

- [#253](https://github.com/markprompt/markprompt-js/pull/253) [`d19ddf6`](https://github.com/markprompt/markprompt-js/commit/d19ddf6bec116f988c1fe1c6da74e591da499645) Thanks [@nickrttn](https://github.com/nickrttn)! - Add support for tool calling

- [#249](https://github.com/markprompt/markprompt-js/pull/249) [`9177b3f`](https://github.com/markprompt/markprompt-js/commit/9177b3fd4d6e0e01f0c342e97d539a2942684ab6) Thanks [@nickrttn](https://github.com/nickrttn)! - Adopt generator-based version of `submitChat` in prompt and chat views

## 0.18.0

### Minor Changes

- [#240](https://github.com/markprompt/markprompt-js/pull/240) [`2b97082`](https://github.com/markprompt/markprompt-js/commit/2b970823f2fe23fa95cf7e13f91822fad11a2acd) Thanks [@nickrttn](https://github.com/nickrttn)! - Show configurable error messages to users when upstream outages occur

## 0.17.3

### Patch Changes

- [#237](https://github.com/markprompt/markprompt-js/pull/237) [`42f059f`](https://github.com/markprompt/markprompt-js/commit/42f059ff58721760fd850d942cb9d5e143f1b8c3) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix CSS flex-start

## 0.17.2

### Patch Changes

- [#229](https://github.com/markprompt/markprompt-js/pull/229) [`b5a7cf2`](https://github.com/markprompt/markprompt-js/commit/b5a7cf24999725aa8439ef23917c675c3951dd07) Thanks [@michaelfester](https://github.com/michaelfester)! - Omit non-serializable options from API calls

## 0.17.1

### Patch Changes

- [#227](https://github.com/markprompt/markprompt-js/pull/227) [`983d857`](https://github.com/markprompt/markprompt-js/commit/983d8576d72756d8daa111252d9eda300f8097b2) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix responsive feedback icons

## 0.17.0

### Minor Changes

- [#222](https://github.com/markprompt/markprompt-js/pull/222) [`368b166`](https://github.com/markprompt/markprompt-js/commit/368b166bdfa8b7333ebe59623233cb62700bd4f2) Thanks [@michaelfester](https://github.com/michaelfester)! - Custom icon and label and default view

## 0.16.5

### Patch Changes

- [#216](https://github.com/markprompt/markprompt-js/pull/216) [`b4dd9d7`](https://github.com/markprompt/markprompt-js/commit/b4dd9d74f63f1437ad008197eb1edf6a17c040ae) Thanks [@michaelfester](https://github.com/michaelfester)! - Add copy code button

## 0.16.4

### Patch Changes

- [#207](https://github.com/markprompt/markprompt-js/pull/207) [`e92eb8d`](https://github.com/markprompt/markprompt-js/commit/e92eb8d261f965848afcca097687b14b28c50be8) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix text font weight

## 0.16.3

### Patch Changes

- [`fcd9eba`](https://github.com/markprompt/markprompt-js/commit/fcd9eba936005e1a0ea60eb3f200bd6ef7ad93a4) Thanks [@nickrttn](https://github.com/nickrttn)! - Add repository key to @markprompt/css package.json

## 0.16.2

### Patch Changes

- [#193](https://github.com/markprompt/markprompt-js/pull/193) [`3733e74`](https://github.com/markprompt/markprompt-js/commit/3733e741e842f881642424e4eff67c136ba3096d) Thanks [@nickrttn](https://github.com/nickrttn)! - Add provenance statements

## 0.16.1

### Patch Changes

- [`1f3e991`](https://github.com/markprompt/markprompt-js/commit/1f3e9914f47f1c10e8d1d4e01e6784622b820ca3) Thanks [@nickrttn](https://github.com/nickrttn)! - Bump to fix broken changesets, no changes

## 0.16.0

### Minor Changes

- [#175](https://github.com/markprompt/markprompt-js/pull/175) [`9b146fe`](https://github.com/markprompt/markprompt-js/commit/9b146fe1b0afd6acfc10470a9cdc4f350ef742e2) Thanks [@nickrttn](https://github.com/nickrttn)! - Add chat history support, syncing chats to local storage to get back to later. Switch between earlier conversations. Enabled by default.

## 0.15.0

### Minor Changes

- [`afd7025`](https://github.com/markprompt/markprompt-js/commit/afd7025e11930e08e28d4ff99f4c8200bef1c661) Thanks [@michaelfester](https://github.com/michaelfester)! - Add conversation id and metadata

## 0.14.0

### Minor Changes

- [`691164c`](https://github.com/markprompt/markprompt-js/commit/691164c7c13af5995ae4330388421401435b8139) Thanks [@michaelfester](https://github.com/michaelfester)! - Add chat support

### Patch Changes

- [#163](https://github.com/markprompt/markprompt-js/pull/163) [`983f098`](https://github.com/markprompt/markprompt-js/commit/983f098298b391bed776bdd75be1e4f4fe9b8798) Thanks [@michaelfester](https://github.com/michaelfester)! - Various style refinements for chat and prompt views

## 0.13.0

### Minor Changes

- [#149](https://github.com/markprompt/markprompt-js/pull/149) [`7718303`](https://github.com/markprompt/markprompt-js/commit/77183036e67837680c50bd4a5c0023234c4df881) Thanks [@nickrttn](https://github.com/nickrttn)! - Add ChatView, allowing for a conversation rather than a single prompt

- [#146](https://github.com/markprompt/markprompt-js/pull/146) [`82f8ac4`](https://github.com/markprompt/markprompt-js/commit/82f8ac4eee7b43ed1e22ad86d211809d88601560) Thanks [@nickrttn](https://github.com/nickrttn)! - Reduce bundle size by ~17kB

## 0.12.0

### Minor Changes

- [#140](https://github.com/markprompt/markprompt-js/pull/140) [`3252bfd`](https://github.com/markprompt/markprompt-js/commit/3252bfd04e0b358c0ade9c1e7826806b568ca9ea) Thanks [@nickrttn](https://github.com/nickrttn)! - Upgrade dependencies

- [#140](https://github.com/markprompt/markprompt-js/pull/140) [`3252bfd`](https://github.com/markprompt/markprompt-js/commit/3252bfd04e0b358c0ade9c1e7826806b568ca9ea) Thanks [@nickrttn](https://github.com/nickrttn)! - Fix issues reported by upgraded linters

## 0.11.1

### Patch Changes

- [#138](https://github.com/markprompt/markprompt-js/pull/138) [`634c21a`](https://github.com/markprompt/markprompt-js/commit/634c21a4e7e8b9bae4599b09d29d4f5b37101ae3) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix tab color

## 0.11.0

### Minor Changes

- [#136](https://github.com/markprompt/markprompt-js/pull/136) [`615d124`](https://github.com/markprompt/markprompt-js/commit/615d1242efd6519079ffcb75305fed6ac5584e76) Thanks [@michaelfester](https://github.com/michaelfester)! - Integrate feedback API

## 0.10.0

### Minor Changes

- [#129](https://github.com/markprompt/markprompt-js/pull/129) [`2c61fbf`](https://github.com/markprompt/markprompt-js/commit/2c61fbf65fd4d4e51093b5f3f46daf31da58d1dc) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Algolia search

- [#129](https://github.com/markprompt/markprompt-js/pull/129) [`2c61fbf`](https://github.com/markprompt/markprompt-js/commit/2c61fbf65fd4d4e51093b5f3f46daf31da58d1dc) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Algolia search

## 0.9.4

### Patch Changes

- [#121](https://github.com/markprompt/markprompt-js/pull/121) [`3586d8e`](https://github.com/markprompt/markprompt-js/commit/3586d8e9339f3b827a5f09f78c4b8d05eb4a8afd) Thanks [@michaelfester](https://github.com/michaelfester)! - Improve keyboard navigation UX

## 0.9.3

### Patch Changes

- [#115](https://github.com/markprompt/markprompt-js/pull/115) [`cf77d71`](https://github.com/markprompt/markprompt-js/commit/cf77d712c4f9814e0d463870df4e45c9574b3438) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix close button alignment

- [#115](https://github.com/markprompt/markprompt-js/pull/115) [`cf77d71`](https://github.com/markprompt/markprompt-js/commit/cf77d712c4f9814e0d463870df4e45c9574b3438) Thanks [@michaelfester](https://github.com/michaelfester)! - Minor UI fixes

- [#115](https://github.com/markprompt/markprompt-js/pull/115) [`cf77d71`](https://github.com/markprompt/markprompt-js/commit/cf77d712c4f9814e0d463870df4e45c9574b3438) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix missing References params for getHref and getLabel

## 0.9.2

### Patch Changes

- [#113](https://github.com/markprompt/markprompt-js/pull/113) [`b29aab3`](https://github.com/markprompt/markprompt-js/commit/b29aab3fe6921c11d13343c4fe805e6655c1036f) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix close button alignment

- [#113](https://github.com/markprompt/markprompt-js/pull/113) [`b29aab3`](https://github.com/markprompt/markprompt-js/commit/b29aab3fe6921c11d13343c4fe805e6655c1036f) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix missing References params for getHref and getLabel

## 0.9.1

### Patch Changes

- [#111](https://github.com/markprompt/markprompt-js/pull/111) [`761acde`](https://github.com/markprompt/markprompt-js/commit/761acde12dc01abb8cd4c6d3dcccc793fdb44919) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix close button alignment

## 0.9.0

### Minor Changes

- [#109](https://github.com/markprompt/markprompt-js/pull/109) [`736b7f7`](https://github.com/markprompt/markprompt-js/commit/736b7f776cc685ca5268ee527954b92c2c1c54b9) Thanks [@michaelfester](https://github.com/michaelfester)! - Add tab layout

## 0.8.1

### Patch Changes

- [#105](https://github.com/markprompt/markprompt-js/pull/105) [`fa0b96a`](https://github.com/markprompt/markprompt-js/commit/fa0b96a6cdf9320f6c588cef75a3ed8a3353c625) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix plain content CSS

## 0.8.0

### Minor Changes

- [#86](https://github.com/markprompt/markprompt-js/pull/86) [`517ffd4`](https://github.com/markprompt/markprompt-js/commit/517ffd44678d87b09e3558e41c57b8389a7e0422) Thanks [@nickrttn](https://github.com/nickrttn)! - Split search and prompt functionality

- [#86](https://github.com/markprompt/markprompt-js/pull/86) [`517ffd4`](https://github.com/markprompt/markprompt-js/commit/517ffd44678d87b09e3558e41c57b8389a7e0422) Thanks [@nickrttn](https://github.com/nickrttn)! - Split up search and prompt inputs to use different states

## 0.7.0

### Minor Changes

- [#95](https://github.com/markprompt/markprompt-js/pull/95) [`251db73`](https://github.com/markprompt/markprompt-js/commit/251db739e996c0a9bb72fea50fc016e5fbccdca8) Thanks [@michaelfester](https://github.com/michaelfester)! - Harmonize references API and use reponse header for references and debug info

- [#80](https://github.com/markprompt/markprompt-js/pull/80) [`9bd2123`](https://github.com/markprompt/markprompt-js/commit/9bd212354ab9d8e79d8c34335f9a0dd8e76176d0) Thanks [@nickrttn](https://github.com/nickrttn)! - Add feedback functionality to the prompt, allowing users to give feedback on the usefulness of prompt answers

## 0.6.1

### Patch Changes

- [#89](https://github.com/markprompt/markprompt-js/pull/89) [`672ffc5`](https://github.com/markprompt/markprompt-js/commit/672ffc5b3af28d12c5eeeb1e39fafed20a494803) Thanks [@michaelfester](https://github.com/michaelfester)! - Add text size

## 0.6.0

### Minor Changes

- [#87](https://github.com/markprompt/markprompt-js/pull/87) [`c5102c5`](https://github.com/markprompt/markprompt-js/commit/c5102c5937e72d6796f885dab9410ed1f5dc36ed) Thanks [@michaelfester](https://github.com/michaelfester)! - Upgrade to new search API

## 0.5.1

### Patch Changes

- [#72](https://github.com/markprompt/markprompt-js/pull/72) [`ad10a87`](https://github.com/markprompt/markprompt-js/commit/ad10a87ead941b13626746dbb5fbef882fc8c0e8) Thanks [@michaelfester](https://github.com/michaelfester)! - Export model types

- [#72](https://github.com/markprompt/markprompt-js/pull/72) [`ad10a87`](https://github.com/markprompt/markprompt-js/commit/ad10a87ead941b13626746dbb5fbef882fc8c0e8) Thanks [@michaelfester](https://github.com/michaelfester)! - Update READMEs

## 0.5.0

### Minor Changes

- [#69](https://github.com/markprompt/markprompt-js/pull/69) [`ce12b03`](https://github.com/markprompt/markprompt-js/commit/ce12b034fea3a03af0ad504cb483c7a8c6eb1673) Thanks [@michaelfester](https://github.com/michaelfester)! - Add plain display option

### Patch Changes

- [#70](https://github.com/markprompt/markprompt-js/pull/70) [`c1605bd`](https://github.com/markprompt/markprompt-js/commit/c1605bd46c672b653e6f92bb7ecf38a9219a7fb7) Thanks [@michaelfester](https://github.com/michaelfester)! - Update READMEs

## 0.4.3

### Patch Changes

- [`a0908bb`](https://github.com/markprompt/markprompt-js/commit/a0908bbf651767a28cc5a3435dde5ce567bd36d2) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix button foreground color

- [`5f1bd3c`](https://github.com/markprompt/markprompt-js/commit/5f1bd3cb049cb34689f36ea9139007e4b220e81a) Thanks [@michaelfester](https://github.com/michaelfester)! - CSS fixes for dark mode, handle focus state for Ask AI button

## 0.4.2

### Patch Changes

- [#59](https://github.com/markprompt/markprompt-js/pull/59) [`1593c0b`](https://github.com/markprompt/markprompt-js/commit/1593c0be12ad08aabf9b1822a06c4b5a6311882f) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix button foreground color

- [#59](https://github.com/markprompt/markprompt-js/pull/59) [`1593c0b`](https://github.com/markprompt/markprompt-js/commit/1593c0be12ad08aabf9b1822a06c4b5a6311882f) Thanks [@michaelfester](https://github.com/michaelfester)! - CSS fixes for dark mode, handle focus state for Ask AI button

## 0.4.1

### Patch Changes

- [#57](https://github.com/markprompt/markprompt-js/pull/57) [`cb917ff`](https://github.com/markprompt/markprompt-js/commit/cb917ff237f5dab6ed75eb9ac90e87f985562cf0) Thanks [@michaelfester](https://github.com/michaelfester)! - CSS fixes for dark mode, handle focus state for Ask AI button

## 0.4.0

### Minor Changes

- [#45](https://github.com/markprompt/markprompt-js/pull/45) [`b607149`](https://github.com/markprompt/markprompt-js/commit/b60714904c2481da40801e16acc2a3c4b0717f85) Thanks [@michaelfester](https://github.com/michaelfester)! - Move References height animations to JS so we can avoid specifying static heights in CSS

### Patch Changes

- [#45](https://github.com/markprompt/markprompt-js/pull/45) [`b607149`](https://github.com/markprompt/markprompt-js/commit/b60714904c2481da40801e16acc2a3c4b0717f85) Thanks [@michaelfester](https://github.com/michaelfester)! - Make the scrollability of the prompt references container easier to discover by adding a small drop shadow when the container overflows.

- [#49](https://github.com/markprompt/markprompt-js/pull/49) [`54af915`](https://github.com/markprompt/markprompt-js/commit/54af9150ea22da96ec4cf3d283d6d8a485696a06) Thanks [@michaelfester](https://github.com/michaelfester)! - Make sure dark/light themes work for Docusaurus

## 0.3.0

### Minor Changes

- [#42](https://github.com/markprompt/markprompt-js/pull/42) [`210cf40`](https://github.com/markprompt/markprompt-js/commit/210cf40dc66bb720af44eac14bc26d075c3042bd) Thanks [@nickrttn](https://github.com/nickrttn)! - Add MarkpromptSearchBoxTrigger styles

## 0.2.0

### Minor Changes

- [#31](https://github.com/markprompt/markprompt-js/pull/31) [`df37791`](https://github.com/markprompt/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e) Thanks [@nickrttn](https://github.com/nickrttn)! - Add search functionality to Markprompt

### Patch Changes

- [#34](https://github.com/markprompt/markprompt-js/pull/34) [`8eb9d01`](https://github.com/markprompt/markprompt-js/commit/8eb9d01253ec624338cb16523bd5585ef1f9e203) Thanks [@nickrttn](https://github.com/nickrttn)! - Fix references container overflow with many references

## 0.1.0

### Minor Changes

- [#18](https://github.com/markprompt/markprompt-js/pull/18) [`c007554`](https://github.com/markprompt/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Add default styles for `@markprompt/web`.

  The styles could also be used for the headless components in `@markprompt/react` given the right classes. For a usage example, see (`@markprompt/web`)[motifland/markprompt-js/blob/main/packages/web/src/Markprompt.tsx].
