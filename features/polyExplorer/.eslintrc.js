module.exports = {
    extends: [
        "@polypoly-eu/eslint-config-polypoly",
        "plugin:react/recommended"
    ],
    env: {
        browser: true
    },
    overrides: [
        {
            // For some reason, plugin:react/recommended doesn't set these options
            files: ["*.jsx"],
            parserOptions: {
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    ]
};
