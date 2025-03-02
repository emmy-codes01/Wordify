import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 9000,
    },
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        assetsInlineLimit: 0,
    },
    base: '/',
})