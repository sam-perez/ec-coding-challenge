module.exports = {
    extends: ['airbnb'],
    plugins: ['prettier'],
    settings: {},
    rules: {
        'import/no-extraneous-dependencies': [
            'error',
            {devDependencies: ['**/*.test.*', '**/*.spec.*']}
        ],
        'max-len': [2, {code: 120}]
    },
    env: {mocha: true}
};
