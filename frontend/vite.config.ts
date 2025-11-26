import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';
import csp from 'vite-plugin-csp';

export default defineConfig({
  base: '/Iu5-web-frontend/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Исторические мастерские',
        short_name: 'Мастерские',
        description: 'Приложение для расчета производственных мощностей',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),
    basicSsl(),
    csp({
      policy: {
        'script-src': ['self', 'unsafe-eval'],
        'style-src': ['self', 'unsafe-inline'],
        'worker-src': ['self'],
      }
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/vlk-images': {
        target: 'http://localhost:9000/vlk-images',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vlk-images/, ''),
      }
    },
    port: 5173,
  }
})