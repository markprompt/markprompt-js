---
'@markprompt/core': patch
---

Don't cancel the `ReadableStream` returned by `res.body.getReader()` when `submitChat` is canceled
