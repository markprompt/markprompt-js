---
'@markprompt/css': minor
---

**Breaking change**: Remove all `:where()` clauses.

Please verify your Markprompt styling carefully after upgrading to this version of `@markprompt/css`.

---

The initial idea with using `:where()` everywhere was to allow users of our CSS library to override the default styles of Markprompt components very easily, as `where()` clauses always have a specificity of 0.

However, we found that because even something like a global defined style, say `ul { border: green; }` affects our CSS it was almost _too easy_ to override our styles. With that, the ease of overriding our styles was also causing breakage and causing users having to write more custom styles than necessary, or even having to duplicate our styles and remove `:where()` clauses themselves.

In the end we've decided to remove all `:where()` clauses from our CSS to make it easier for users to work with our CSS in a more familiar way, eg. by overriding a class.
