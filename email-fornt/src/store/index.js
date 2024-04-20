// store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    count: 0,
    userAvatar: "",
  },
  mutations: {
    setUserInfo(state, user) {
      state.userInfo = user;
    },
    setAvatar(state, user) {
      state.userAvatar = user;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      console.log("commit", commit);
    },
  },
});
