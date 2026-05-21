import coreWebVitalsConfig from 'eslint-config-next/core-web-vitals'

const tsPlugin = coreWebVitalsConfig.find((c) => c.plugins?.['@typescript-eslint'])?.plugins?.[
  '@typescript-eslint'
]

const eslintConfig = [
  ...coreWebVitalsConfig,
  ...(tsPlugin
    ? [
        {
          files: ['**/*.ts', '**/*.tsx'],
          plugins: { '@typescript-eslint': tsPlugin },
          rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
          },
        },
      ]
    : []),
  {
    rules: {
      'import/order': 'off',
    },
  },
]

export default eslintConfig
