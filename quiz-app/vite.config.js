import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: '/quiz-app-frontend/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __VUE_PROD_DEVTOOLS__: false
  },
})