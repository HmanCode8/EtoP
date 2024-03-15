import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/global.scss' // 引入全局的 SCSS 文件
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import 'tailwindcss/tailwind.css'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus).use(router).use(store).mount('#app')
