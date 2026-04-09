import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const reactFiles = ['**/*.{jsx,tsx}'];

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/.nx/**',
    '**/coverage/**',
    'apps/MOBILE/android/**',
    'apps/MOBILE/ios/**',
    '**/build/**',
    '**/*.config.js',
    '**/*.config.cjs',
    '**/*.config.mjs',
    '**/babel.config.js',
    '**/metro.config.js',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
        __DEV__: 'readonly',
      },
    },
  },
  react.configs.flat.recommended,
  {
    files: reactFiles,
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: reactFiles,
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      /** RN Animated commonly uses `useRef(...).current` for stable animated values; not the same as React DOM refs. */
      'react-hooks/refs': 'off',
      /** Modal “reset form when opened” patterns often use setState in an effect; too noisy as error for this codebase. */
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
  {
    files: ['apps/MOBILE/components/Logo.tsx'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  eslintConfigPrettier,
);
