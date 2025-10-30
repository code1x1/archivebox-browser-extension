import path from "path"

export default {
    publicDir: "./public",
    build: {
        outDir: "./dist",
        rollupOptions: {
            input: {
                options: path.resolve(__dirname, 'options.html'),
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