import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: ''
  },
  mutations: {
    setAccessToken (state, newAccessToken) {
      state.accessToken = newAccessToken
      console.log(state.accessToken)
    }
  },
  actions: {
  },
  modules: {
  }
})
