---
"@markprompt/react": minor
"@markprompt/css": minor
"@markprompt/docusaurus-theme-search": minor
"@markprompt/web": minor
---

Add file attachment support for create ticket view

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
