import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      }
    },
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      'class-methods-use-this': 0,
      'comma-dangle': ['error', 'never'],
      'linebreak-style': 0,
      'global-require': 0,
      'eslint linebreak-style': [0, 'error', 'windows'],
      'no-new': 0,
      'no-restricted-globals': 0,
      'no-restricted-syntax': 0,
      'no-console': 0,
      'no-underscore-dangle': 0,
      'import/extensions': 0
    }
  }
];
