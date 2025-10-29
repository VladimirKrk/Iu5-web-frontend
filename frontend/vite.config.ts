import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      
      '/vlk-images': {
        // Целимся прямо в бакет
        target: 'http://localhost:9000/vlk-images', 
        changeOrigin: true,
        // Убираем из пути запроса название бакета, чтобы оно не дублировалось
        rewrite: (path) => path.replace(/^\/vlk-images/, ''),
      }
    }
  }
})