import jest from "eslint-plugin-jest";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("airbnb-base", "plugin:jest/all"), {
    plugins: {
        jest,
    },

    languageOptions: {
        globals: {
            ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            ...globals.jest,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        ecmaVersion: 2018,
        sourceType: "module",
    },

    rules: {
        "max-classes-per-file": "off",
        "no-underscore-dangle": "off",
        "no-console": "off",
        "no-shadow": "off",
        "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    },
    
    settings: {
        jest: {
            version: 28, // Set the Jest version explicitly
        },
    }
}, {
    files: ["**/*.js"],
    ignores: ["**/babel.config.js"],
}];
