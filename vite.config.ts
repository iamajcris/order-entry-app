import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Proxy API calls to your backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 👈 Change to your API URL
        changeOrigin: true,
      },
    },
  },
})
