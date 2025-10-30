export default {
    root: "./src",
    build: {
        outDir: "dist"
    },
    server: {
        open: '/options.html',
        hmr: true
    }
} satisfies import('vite').UserConfig