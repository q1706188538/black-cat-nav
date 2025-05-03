import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    assetsInlineLimit: 0, // 禁用小资源内联，确保所有资源都作为单独的文件处理
  },
  server: {
    fs: {
      // 允许服务来自项目根目录之外的文件
      allow: ['..']
    }
  }
})
