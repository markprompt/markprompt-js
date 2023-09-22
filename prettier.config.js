module.exports = {
  arrowParens: 'always',
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  proseWrap: 'never',
  overrides: [
    {
      files: ['*.md', '*.mdx', '*.yml'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: ['**/.changeset/*.md', '**/CHANGELOG.MD'],
      options: {
        proseWrap: 'never',
      },
    },
  ],
};
