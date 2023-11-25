module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',

    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md#when-not-to-use-it
    // https://github.com/yannickcr/eslint-plugin-react/issues/3052#issuecomment-1017555974
    'plugin:react/jsx-runtime',

    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/require-default-props': 'off', // we don't use prop-types

    'import/prefer-default-export': 'off', // force named exports
    'import/no-default-export': 'error',
    'import/order': ['error', { 'newlines-between': 'always' }],

    '@typescript-eslint/no-unused-vars': 'warn', // 'error' is not convinient in development

    'consistent-return': 'off', // we want functions to have different return behavior

    'react/jsx-props-no-spreading': ['error', { exceptions: ['Input', 'FileInput', 'Textarea', 'Select'] }], // disable for form elements, cuz @mantine/form input props needs to be desctructured
    "jsx-a11y/label-has-associated-control": ["error", {
      "required": {
        "some": ["nesting", "id"]
      }
    }],
    "jsx-a11y/label-has-for": ["error", {
      "required": {
        "some": ["nesting", "id"]
      }
    }]
  },
  }
