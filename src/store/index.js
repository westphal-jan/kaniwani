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
  mutations: {
    setAccessToken(state, newAccessToken) {
      state.accessToken = newAccessToken;
    },
    setUserData(state, { username, level }) {
      state.username = username;
      if (state.level !== level) {
        const logMessage =
          state.level === null ? "Initalize Vocabulary" : "Update Vocabulary";
        console.log(logMessage);
        state.level = level;
        this.commit("updateKanaToVocabulary");
      }
    },
    setKanaToVocabulary(state, kanaToVocabulary) {
      state.kanaToVocabulary = kanaToVocabulary;
    },
    async updateKanaToVocabulary(state) {
      const maxLevel = state.level > 3 ? 3 : state.level - 1;
      const kanaToVocabulary = await getKanaToVocabulary(
        state.accessToken,
        maxLevel
      );
      state.kanaToVocabulary = kanaToVocabulary;
      localStorage.setItem(
        "kanaToVocabulary",
        JSON.stringify(state.kanaToVocabulary)
      );
    },
  },
  actions: {},
  modules: {},
  plugins: [
    vuejsStorage({
      keys: ["accessToken", "username", "level"],
      namespace: "kaniwani",
      driver: vuejsStorage.drivers.localStorage,
    }),
  ],
});
