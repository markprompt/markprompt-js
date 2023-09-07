---
'@markprompt/core': minor
---

Remove `submitPrompt` in favor of `submitChat`. To migrate single question
prompt implementations, instead of `submitPrompt(prompt, ...)` call
`submitChat([{ content: prompt, role: 'user' }], ...)` with the same arguments.
