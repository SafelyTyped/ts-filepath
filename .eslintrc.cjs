module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended-type-checked"],
    parser: '@typescript-eslint/parser',
    "parserOptions": {
        "project": true,
        tsconfigRootDir: "src",
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    plugins: ['@typescript-eslint'],
    root: true,
    overrides: [
        {
            extends: [
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            files: ['./src/**/*.{ts,tsx}'],
            rules: {
                "@typescript-eslint/no-base-to-string": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-unused-vars": "off",
            }
        },
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/no-base-to-string": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-import-type-side-effects": "error"
    }
};