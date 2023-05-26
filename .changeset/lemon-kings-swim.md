---
'@markprompt/react': minor
---

- add a `useMarkpromptContext` hook for use in headless component compositions
- add `forwardRef` to headless components where possible
- add `showBranding` prop to `Markprompt.Content`
- add `hide` prop to `Markprompt.Title` and `Markprompt.Description` that allows you to
  accessibly hide the components
- add `autoScroll` prop to `Markprompt.AutoScroller`
- add `scrollBehavior` prop to `Markprompt.AutoScroller`
- call user provided event handlers in components where we call event handlers ourselves
- specify props passed to DOM elements as defaults, making them overridable by users
- remove unused options from `useMarkprompt`
