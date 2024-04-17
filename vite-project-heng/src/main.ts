import { createApp } from "vue";
import App from "./App.vue";

import "tailwindcss/tailwind.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./style.scss"; // 引入自定义主题文件 // 引入全局的 SCSS 文件
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";

console.log(" HI: ", import.meta.env.HI);
console.log(" VITE_HI: ", import.meta.env.VITE_HI);
console.log(" VITE_HI: ", import.meta.env.VITE_BASE_URL);
console.log(" HELLO: ", import.meta.env.HELLO);
console.log(" VITE_HELLO: ", import.meta.env.VITE_HELLO);
console.log(" MD: ", import.meta.env.MD);
console.log(" VITE_MD: ", import.meta.env.VITE_MD);

// import 'tailwindcss/tailwind.css'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus).use(router).use(store).mount("#app");
