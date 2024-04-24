import { createStore } from 'vuex';

const store = createStore({
  state: {
    userId: '',
    username: ''
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {
    setUserId({ commit }, userId) {
      commit('setUserId', userId);
    },
    setUsername({ commit }, username) {
      commit('setUsername', username);
    }
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getUsername(state) {
      return state.username;
    }
  }
});

export default store;
