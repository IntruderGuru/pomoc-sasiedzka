import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: { js, 'simple-import-sort': simpleImportSort },
        extends: ['js/recommended'],
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error'
        }
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser }
    },
    tseslint.configs.recommended,
    eslintPluginPrettier
]);
