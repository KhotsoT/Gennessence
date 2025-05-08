import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'styled-components',
            'zustand',
            'axios',
          ],
          admin: [
            './src/pages/admin/Dashboard.tsx',
            './src/pages/admin/Products.tsx',
            './src/pages/admin/Orders.tsx',
            './src/pages/admin/Users.tsx',
            './src/pages/admin/Analytics.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
