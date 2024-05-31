import { defineStore } from 'pinia'

// 定义一个名为 user 的 Store
export default defineStore('user', {
  state: () => ({
    theme: localStorage.getItem('theme'),
    navActive: '/home',
    uploadState: '',
  }),
  actions: {
    //主题切换
    toggleTheme(value) {
      this.theme = value
    },
    setNavActive(value) {
      this.navActive = value
    },
    setUploadState(value) {
      this.uploadState = value
    },
  },
})
