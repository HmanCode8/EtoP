import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "bytemd/dist/index.css";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "./style.scss"; // 引入全局的 SCSS 文件
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue"; //引入element-plus的icon
const pinia = createPinia();
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus).use(router).use(pinia).mount("#app");
