// router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Email from "../views/Email.vue";
import WebApi from "../views/WebApi.vue";
import _ from "lodash";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }, // 标记需要认证的路由
  },
  {
    path: "/email",
    name: "Email",
    component: Email,
    meta: { requiresAuth: true }, // 标记需要认证的路由
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/webApis",
    name: "WebApis",
    component: WebApi,
  },
  // 其他路由配置...
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log(from);
  // 检查路由是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查用户是否已登录，这里假设有一个名为 isAuthenticated 的全局变量表示用户登录状态
    const isAuthenticated = _.isEmpty(sessionStorage.getItem("token"));
    if (isAuthenticated) {
      // 用户未登录，重定向到登录页面
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 将跳转前的路由路径作为参数传递给登录页面
      });
    } else {
      // 用户已登录，放行
      next();
    }
  } else {
    // 路由不需要认证，放行
    next();
  }
});

export default router;
