import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      // 配置代理，将以 /api 开头的请求代理到目标地址
      '/api': {
        target: 'http://localhost:3000', // 目标地址
        changeOrigin: false, // 是否改变请求的源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，如果不需要重写，可以省略此项
      },
    },
  },
  plugins: [
    [vue()],
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ]
})
