import './assets/main.css'
import './index.scss';

import { createApp } from 'vue'
import App from './App.vue'
// Импорт для регистрации PWA (если используешь vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'

// Интервал проверки обновлений (опционально)
const updateSW = registerSW({
  onNeedRefresh() {
    // Здесь можно показать пользователю уведомление: "Доступна новая версия. Обновить?"
    // Но так как у нас registerType: 'autoUpdate', оно обновится само при следующем заходе
    console.log('New content available, preparing to update.')
  },
  onOfflineReady() {
    console.log('App is ready to work offline.')
  },
})

createApp(App).mount('#app')
