module.exports = {
    extends: [
        "@polypoly-eu/eslint-config",
        "plugin:react/recommended"
    ],
    env: {
        browser: true,
        es6: true
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        "react/prop-types": 0
    },
    overrides: [
        {
            files: ["*.js", "*.jsx"],
            parserOptions: {
                sourceType: "module"
            }
        },
        {
            // For some reason, plugin:react/recommended doesn't set this
            files: ["*.jsx"],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    ]
};
