import { createApp } from "vue";
import App from "./App.vue";

// import "tailwindcss/tailwind.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./style.scss"; // 引入自定义主题文件 // 引入全局的 SCSS 文件
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus).use(router).use(store).mount("#app");
