module.exports = {
  extends: [
    './node_modules/eslint-config-airbnb-base/index.js',
    'plugin:react/recommended'
  ],
  env: {
    "browser": true,
  },
  rules: {
    "no-param-reassign": 0,
    "no-restricted-syntax": 0,
    "no-bitwise": "off",
    "no-underscore-dangle": "off"
  },
  "parserOptions": {
    "ecmaFeatures": {
        "spread": true,
        "destructuring": true,
    }
  },
  "parser": "babel-eslint",
};