import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/slide-demo/',

  plugins: [vue(), vueDevTools(), sentryVitePlugin({
    org: "victor-a4",
    project: "trial-slide"
  })],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0', // Esto hace que el servidor escuche en todas las interfaces
    port: 5174, // Asegúrate de que el puerto es el correcto
  },

  build: {
    sourcemap: true
  }
})