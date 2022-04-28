module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'no-underscore-dangle': 0,
    '@typescript-eslint/naming-convention': 1,
    'react/require-default-props': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
  },
  ignorePatterns: ['dist/**/*', 'build/**/*', 'public/**/*', 'node_modules/**/*'],
};
