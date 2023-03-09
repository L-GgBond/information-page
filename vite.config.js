import { fileURLToPath, URL } from 'node:url'
import WindiCSS from 'vite-plugin-windicss'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),WindiCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~':path.resolve(__dirname,'src'),
    }
  },
  server:{
    host:'0.0.0.0',
    port:8086,
    proxy:{
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },

  }
})
