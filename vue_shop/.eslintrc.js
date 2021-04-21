module.exports = {
    root: true,

    env: {
        node: true
    },

    extends: [
        'plugin:vue/base',
        '@vue/standard'
    ],

    parserOptions: {
        parser: 'babel-eslint'
    },

    rules: {
        indent: ['off', 2],
        'no-console': 'off',
        'no-debugger': 'off',
        'space-before-function-paren': 0,
        camelcase: 0,
        'comma-dangle': 0,
        'no-unused-expressions': 0

    }
}
