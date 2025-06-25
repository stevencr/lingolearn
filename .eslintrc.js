module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    //'no-console': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    strict: ['error', 'global'],
    //'no-magic-numbers': ['error', {ignore: [0, 1], ignoreArrayIndexes: true}],
    'consistent-return': 'error',
    'no-else-return': 'error',
    //'no-use-before-define': 'error',
    'prefer-const': 'error',
    'no-restricted-syntax': ['error', 'WithStatement'],
    eqeqeq: 'error',
    complexity: ['error', 10],
  },
};
