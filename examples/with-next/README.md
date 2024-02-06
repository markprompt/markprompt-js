# `with-next`

This example contains a reference implementation of
[`@markprompt/react`](../../packages/react/README.md) with
[Next.js](https://nextjs.org), and featuring [Algolia](https://algolia.com/) docs search.

## Getting Started

Create a `.env.local` file at the root of the project, and add the following:

```
NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY=<MARKPROMPT_PROJECT_KEY>
NEXT_PUBLIC_ALGOLIA_API_KEY=<ALGOLIA_API_KEY>
NEXT_PUBLIC_ALGOLIA_APP_ID=<ALGOLIA_APP_ID>
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=<ALGOLIA_INDEX_NAME>
```

Start the local dev server:

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 and see the result.

## Documentation

To use the Markprompt platform as is, please refer to the
[Markprompt documentation](https://markprompt.com/docs).

## Community

- [X](https://x.com/markprompt)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).
