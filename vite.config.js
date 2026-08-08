import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react"

export default defineConfig({
    root: "./",
    publicDir: "./public",
    server: {
        open: "/index.html"
    },
    resolve: {
        alias: {}
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true
            }
        }
    }
});