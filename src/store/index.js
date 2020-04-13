import Vue from "vue";
import Vuex from "vuex";
import vuejsStorage from "vuejs-storage";
import { getKanaToVocabulary } from "../api";

Vue.use(Vuex);
Vue.use(vuejsStorage);

export default new Vuex.Store({
  state: {
    accessToken: "",
    username: "",
    level: 1,
    kanaToVocabulary: {},
  },
  getters: {
    getNumKanaToVocabulary: (state) => {
      return Object.keys(state.kanaToVocabulary).length;
    },
  },
  mutations: {
    setAccessToken(state, newAccessToken) {
      state.accessToken = newAccessToken;
    },
    setUserData(state, { username, level }) {
      state.username = username;
      if (state.level !== level) {
        const logMessage =
          state.level === 1 ? "Initalize Vocabulary" : "Update Vocabulary";
        console.log(logMessage);
        state.level = level;
        this.commit("updateKanaToVocabulary");
      }
    },
    setKanaToVocabulary(state, kanaToVocabulary) {
      console.log("Num items", kanaToVocabulary.data.length);
      state.kanaToVocabulary = kanaToVocabulary;
    },
    async updateKanaToVocabulary(state) {
      const maxLevel = state.level - 1;
      const kanaToVocabulary = await getKanaToVocabulary(
        state.accessToken,
        maxLevel
      );
      state.kanaToVocabulary = kanaToVocabulary;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    vuejsStorage({
      keys: ["accessToken", "username"],
      namespace: "kaniwani",
      driver: vuejsStorage.drivers.localStorage,
    }),
  ],
});
