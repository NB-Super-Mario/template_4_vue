module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier', /* '@vue/airbnb',  */ '@vue/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'object-curly-newline': 0,
    'arrow-parens': 0,
    'prettier/prettier': ['error', { singleQuote: true }],
    'vue/html-self-closing': 0,
    'vue/html-end-tags': 0,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
