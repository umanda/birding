const { defineConfig, globalIgnores } = require('eslint/config');
const expoFlat = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores(['dist/', '.expo/', 'coverage/']),
  expoFlat,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'warn',
      'import/no-default-export': 'error',
    },
  },
  {
    // Expo Router requires default exports for routes.
    files: ['src/app/**'],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    // ADR 0002: a feature is used only through its index.ts.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*', '../*'],
              message: "Use '@/…' paths; import another feature only via '@/features/<name>'.",
            },
          ],
        },
      ],
    },
  },
  {
    // ADR 0002: shared code never depends on features.
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['@/features/*'], message: 'shared/ must not import features/.' }] },
      ],
    },
  },
  prettier,
]);
