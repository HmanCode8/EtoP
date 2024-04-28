import { defineStore } from "pinia";

// 定义一个名为 user 的 Store
export default defineStore("user", {
  state: () => ({
    navActive: "/home",
  }),
  actions: {
    setNavActive(value) {
      this.navActive = value;
    },
  },
});
