---
'@markprompt/react': patch
---

Use star import for @radix-ui/react-dialog

`@radix-ui/react-dialog` is [packaged incorrectly](https://github.com/radix-ui/primitives/issues/1848). Because of this, some
tools (Next.js) must use a default import to import it, whereas others
(Vite, Docusaurus) must use a star import. Since our demos use Vite and
Docusaurus, let’s go with star imports.
