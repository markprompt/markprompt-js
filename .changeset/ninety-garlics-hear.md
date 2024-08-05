---
'@markprompt/core': minor
---

Remove the barrel file in `@markprompt/core` in favor of package.json exports.

You will now need to import from specific exports, eg.  `import { submitChat } from '@markprompt/core/chat'` instead of `import { submitChat } from '@markprompt/core'`.
