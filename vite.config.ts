import path from "path"

export default {
    publicDir: "./public",
    build: {
        outDir: "./dist",
        rollupOptions: {
            input: {
                options: path.resolve(__dirname, 'options.html'),
                popup: path.resolve(__dirname, 'src/popup.ts'), 
                background: path.resolve(__dirname, 'src/background.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        },
        emptyOutDir: true,
        copyPublicDir: true
    },
    server: {
        open: "/options.html",
        hmr: true
    }
} satisfies import("vite").UserConfig