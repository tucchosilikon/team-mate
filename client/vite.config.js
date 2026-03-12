import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            }
        },
        allowedHosts: [
            'localhost',
            'ending-usage-suits-trees.trycloudflare.com',
            'teammate-frontend.onrender.com'
        ],
        watch: {
            usePolling: true
        }
    }
})
