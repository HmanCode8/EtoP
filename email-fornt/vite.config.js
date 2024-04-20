import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// const baseDir = process.env.VITE_APP_ENV === 'development' ? '/global_dev.js' : '/global.js';
console.log(process.env.NODE_ENV);
export default defineConfig(({ mode }) => {
  return {
    envDir: "env",
    transpileDependencies: ["vuetify"],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        // 配置代理，将以 /api 开头的请求代理到目标地址
        "/api": {
          target: "http://localhost:3000", // 目标地址
          changeOrigin: false, // 是否改变请求的源地址
          rewrite: (path) => path.replace(/^\/api/, ""), // 重写请求路径，如果不需要重写，可以省略此项
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
    ],
    // 根据环境定义全局变量
    __GLOBAL_JS_FILE__: JSON.stringify(
      mode === "production" ? "/config/global.js" : "/config/global_dev.js"
    ),
  };
});
