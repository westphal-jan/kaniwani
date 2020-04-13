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
    currentKana: "",
    givenAnswersToValidVocabulary: {},
    numAnswered: 0,
  },
  getters: {
    getNumKanaToVocabulary: (state) => {
      return Object.keys(state.kanaToVocabulary).length;
    },
    expectedVocabulary: (state) => {
      return state.kanaToVocabulary[state.currentKana];
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
    async updateKanaToVocabulary(state) {
      const maxLevel = state.level - 1;
      const kanaToVocabulary = await getKanaToVocabulary(
        state.accessToken,
        maxLevel
      );
      const sortedKanaToVocabulary = Object.keys(kanaToVocabulary)
        .sort((a, b) => kanaToVocabulary[b].length - kanaToVocabulary[a].length)
        .reduce(
          (o, key) => Object.assign(o, { [key]: kanaToVocabulary[key] }),
          {}
        );
      state.kanaToVocabulary = sortedKanaToVocabulary;
      this.commit("newKana");
    },
    newKana(state) {
      const kanas = Object.keys(state.kanaToVocabulary);
      if (!kanas.length) {
        return;
      }
      // TODO: Think about strategies
      // const randomKana = kanas[(kanas.length * Math.random()) << 0];
      const randomKana = kanas[state.numAnswered];
      state.currentKana = randomKana;
    },
    giveAnswers(state, givenAnswers) {
      // state.givenAnswers = givenAnswers;
      var givenAnswersToValidVocabulary = {};
      for (var givenAnswer of givenAnswers) {
        givenAnswersToValidVocabulary[givenAnswer] =
          state.kanaToVocabulary[state.currentKana];
      }
      state.givenAnswersToValidVocabulary = givenAnswersToValidVocabulary;
    },
    addNewAnswer(state) {
      state.numAnswered++;
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
