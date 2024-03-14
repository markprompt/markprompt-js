---
'@markprompt/core': patch
'@markprompt/react': patch
---

Improve handling of aborted requests by checking for an aborted signal before every yield in `submitChat`

Async generators have no real way to deal with cancellation via
AbortController in modern JS. This commit adds a check for an aborted
signal before every yield in the core/submitChat generator, then throws
the error if the signal has been aborted.

This should prevent yields from happening after the signal has been aborted.
