import oxc from '@prettier/plugin-oxc'

// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    singleAttributePerLine: true,
    jsxBracketSameLine: false,
    overrides: [
        {
            files: ['**/*.{js,mjs,cjs,jsx,html}', '*.html'],
            options: {
                plugins: [oxc],
                parser: 'oxc',
            },
        },
        {
            files: ['**/*.{ts,mts,cts,tsx}'],
            options: {
                plugins: [oxc],
                parser: 'oxc-ts',
            },
        },
    ],
}

export default config
