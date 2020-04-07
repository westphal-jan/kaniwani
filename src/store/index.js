import Vue from "vue";
import Vuex from "vuex";
import vuejsStorage from "vuejs-storage";

Vue.use(Vuex);
Vue.use(vuejsStorage);

export default new Vuex.Store({
  state: {
    accessToken: "",
    username: "",
    level: 1,
  },
  mutations: {
    setAccessToken(state, newAccessToken) {
      state.accessToken = newAccessToken;
    },
    setUserData(state, { username, level }) {
      state.username = username;
      state.level = level;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    vuejsStorage({
      keys: ["accessToken"],
      namespace: "kaniwani",
      driver: vuejsStorage.drivers.localStorage,
    }),
  ],
});
