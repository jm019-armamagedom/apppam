module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    // Enforce Prettier formatting
    'prettier/prettier': 'error',
    // Prefer explicit any only when truly needed
    '@typescript-eslint/no-explicit-any': 'warn',
    // Disable prop-types requirement (we use TS)
    'react/prop-types': 'off',
    // Allow unused vars prefixed with underscore
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
