import { createStore } from 'vuex';

const store = createStore({
  state: {
    username: ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {
    setUsername({ commit }, username) {
      commit('setUsername', username);
    }
  },
  getters: {
    getUsername(state) {
      return state.username;
    }
  }
});

export default store;