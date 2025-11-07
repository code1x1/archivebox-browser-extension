import { defineConfig, UserConfig } from 'vite'
import preact from '@preact/preset-vite'
import webExtension from 'vite-plugin-web-extension'
import inlineSource from 'rollup-plugin-inline-source'

const target = process.env.TARGET ?? 'firefox'
const manifest =
    target === 'chrome'
        ? './src/manifest.chrome.json'
        : './src/manifest.firefox.json'

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    publicDir: './public',
    plugins: [
        preact(),
        webExtension({
            manifest: manifest,
            transformManifest: (manifest) => {
                manifest.content_security_policy = {
                    extension_pages:
                        env.mode === 'development'
                        ? "script-src 'self' 'unsafe-eval' http://localhost:5173; object-src 'self';"
                        : "script-src 'self'; object-src 'self';"
                }
                return manifest;
            },
            webExtConfig: {
                target: "firefox-desktop",
                devtools: true
            },
            browser: target,
            disableAutoLaunch: false,
        }) as unknown as UserConfig['plugins'][0],
        inlineSource({
          include: ['src/**/*.js', 'src/**/*.css'],
        })
    ],
    build: {
        outDir: `dist-${target}`,
        emptyOutDir: true,
        cssCodeSplit: false,
    },
    server: {
        hmr: false
    }
}))
