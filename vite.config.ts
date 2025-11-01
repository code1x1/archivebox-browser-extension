import path from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: './public',
    build: {
        outDir: './dist',
        rollupOptions: {
            input: {
                options: path.resolve(__dirname, 'options.html'),
                popup: path.resolve(__dirname, 'src/popup.ts'),
                background: path.resolve(__dirname, 'src/background.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
        emptyOutDir: true,
        copyPublicDir: true,
    },
    server: {
        open: '/options.html',
        hmr: true,
    },
    plugins: [preact()]
})
