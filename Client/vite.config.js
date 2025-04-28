import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    historyApiFallback: true,
  },
  proxy: {
    "/signin": "http://127.0.0.1:8000",
    "/signup": "http://127.0.0.1:8000",
  },
})
