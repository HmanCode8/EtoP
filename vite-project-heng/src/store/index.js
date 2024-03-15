// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    setUserInfo(state,user) {
      state.userInfo = user
    }
  },
  actions: {
    incrementAsync({ commit }) {
      console.log('commit',commit)
    }
  }
})
