import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['dist', 'node_modules', '**/*.min.js'],
    },
    {
        files: ['**/*.{js,ts,jsx,tsx,vue}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: {
            vue,
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            ...(vue.configs['flat/vue3-recommended']?.rules ?? {}),
            'vue/multi-word-component-names': 'off',
            'prettier/prettier': 'error',
        },
    },
];
