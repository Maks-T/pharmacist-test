import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate', // Автоматическое обновление Service Worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-32x32.png'], // Файлы из public, которые нужно кэшировать
      manifest: {
        name: 'Тест для фармацевта на категорию',
        short_name: 'Фарма Тест', // Короткое имя для иконки на экране
        description: 'Профессиональная подготовка к аттестации фармацевтов в Беларуси',
        theme_color: '#2b5797',
        background_color: '#ffffff',
        display: 'standalone', // Приложение будет открываться без интерфейса браузера
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Для правильного отображения на Android
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})