import prettier from 'eslint-config-prettier';
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  prettier,

  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'legacy/**',
      'tools/legacy-import/extracted/**',
      'tests/visual/__baseline__/**',
      'src/shared/config/image-registry.ts',
    ],
  },

  /**
   * Architectural boundaries.
   *
   * The rule that matters: features are independent. A feature may use the
   * shared layer and the router may use features, but one feature reaching
   * into another turns the tree back into a ball of mud. When two features
   * genuinely need the same thing, it belongs in `shared`.
   * See docs/ARCHITECTURE.md.
   */
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'feature', pattern: 'src/features/*/**', capture: ['feature'] },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/include': ['src/**/*'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: [{ element: { type: 'app' } }],
              allow: [
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'app' } } },
              ],
            },
            {
              // A feature may reach its own internals and the shared layer —
              // never a sibling feature. Cross-feature composition happens at
              // the route. See docs/ARCHITECTURE.md.
              from: [{ element: { type: 'feature' } }],
              allow: [
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: { type: 'feature', captured: { feature: '{{from.feature}}' } },
                  },
                },
              ],
            },
            {
              from: [{ element: { type: 'shared' } }],
              allow: [{ to: { element: { type: 'shared' } } }],
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@vercel/*'],
              message:
                'The deployment target must stay interchangeable. See docs/DEPLOYMENT.md.',
            },
            {
              group: ['../../features/*', '@/features/*/ui/*', '@/features/*/model/*'],
              message: 'Import a feature through its index.ts, not its internals.',
            },
          ],
        },
      ],
    },
  },

  /**
   * No em dashes in anything the site renders.
   *
   * A house style rule, asked for in review: the copy uses commas, colons and
   * full stops instead. It is enforced here rather than trusted to memory
   * because an em dash is easy to introduce without noticing, and easy to
   * reintroduce when transcribing supplied copy that contains one.
   *
   * Scoped to string literals and JSX text, so prose in comments is not
   * affected. En dashes are left alone; only the em dash was objected to.
   */
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\u2014/]',
          message:
            'No em dashes in site copy. Use a comma, a colon or a full stop. See docs/FEEDBACK.md.',
        },
        {
          selector: 'TemplateElement[value.raw=/\\u2014/]',
          message:
            'No em dashes in site copy. Use a comma, a colon or a full stop. See docs/FEEDBACK.md.',
        },
        {
          selector: 'JSXText[value=/\\u2014/]',
          message:
            'No em dashes in site copy. Use a comma, a colon or a full stop. See docs/FEEDBACK.md.',
        },
      ],
    },
  },

  {
    files: ['tools/**/*.mjs', 'tests/**/*.ts', '*.config.{ts,mjs}'],
    rules: { 'no-console': 'off' },
  },
];

export default eslintConfig;
