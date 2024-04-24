module.exports = {
  arrowParens: 'always',
  plugins: ['prettier-plugin-packagejson'],
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
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
