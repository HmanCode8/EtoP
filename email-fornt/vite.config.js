import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";

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
      outDir: "email",
      // 根据环境加载不同的配置
      sourcemap: process.env.NODE_ENV === "production" ? false : true,
      rollupOptions: {
        output: {
          entryFileNames: `js/[name].[hash].js`,
          chunkFileNames: `js/[name].[hash].js`,
          assetFileNames: `css/[name].[hash].css`,
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
    base: "./",
    plugins: [
      [vue()],
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          AntDesignVueResolver({
            importStyle: false, //不单独导入样式，对样式进行全局引入
          }),
        ],
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "https://aip.baidubce.com", // 目标基础路径
          changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
          rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径：如果请求路径以 /api 开头，则替换为 ''
        },
      },
    },
  };
});
