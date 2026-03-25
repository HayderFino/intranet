import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: ["**/node_modules/**", "**/dist/**", "administracion/editor/"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off" 
        }
    }
];
