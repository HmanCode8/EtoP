import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

console.log(process.env.VITE_APP_ENV);
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
    build: {
      // 根据环境加载不同的配置
      sourcemap: process.env.NODE_ENV === "production" ? false : true,
    },
    define: {
      // 定义环境变量
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
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
  };
});
