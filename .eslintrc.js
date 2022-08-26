module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  plugins: [
    'react',
    '@typescript-eslint/eslint-plugin'
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  ignorePatterns: ['.eslintrc.js'],
}
