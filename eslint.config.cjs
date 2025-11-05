// Flat ESLint config (CommonJS) to avoid ESM warning without changing project type
const js = require('@eslint/js')
const nextPlugin = require('@next/eslint-plugin-next')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const globals = require('globals')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      '.turbo/**',
      '.vercel/**',
      'coverage/**',
      'public/**',
      '**/*.d.ts',
      '**/*.min.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'off',
    },
  },
  {
    files: [
      'src/app/**/*.{ts,tsx,js,jsx}',
      'src/components/**/*.{ts,tsx,js,jsx}',
      'src/hooks/**/*.{ts,tsx,js,jsx}',
      'src/lib/**/*.{ts,tsx,js,jsx}',
      'src/pages/**/*.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'writable',
      },
    },
  },
  {
    files: [
      'prisma/**/*.{ts,js}',
      'scripts/**/*.{ts,js}',
      'src/server/**/*.{ts,js}',
      'src/middleware.ts',
      'tailwind.config.ts',
      'eslint.config.cjs',
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    },
  },
  {
    files: ['supabase/functions/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        Deno: 'readonly',
        Response: 'readonly',
        fetch: 'readonly',
      },
    },
  },
]
