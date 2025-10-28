// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены на ваш бэкенд
      '/api': {
        target: 'http://localhost:8080', // Адрес вашего Go-сервиса
        changeOrigin: true,
        secure: false,
      },
      // Прокси для изображений из MinIO
      '/vlc-images': {
         target: 'http://localhost:9000', // Адрес MinIO
         changeOrigin: true,
         secure: false,
      }
    }
  }
})