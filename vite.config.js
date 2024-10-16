import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'primevue': path.resolve(__dirname, 'node_modules/primevue'),
    },
  },
  optimizeDeps: {
    include: ['primevue/config']
  },
  build: {
    commonjsOptions: {
      esmExternals: true 
    },
  }
})