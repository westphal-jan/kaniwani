import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  mounted() {
    if (localStorage.getItem("kanaToVocabulary")) {
      try {
        store.commit(
          "setKanaToVocabulary",
          JSON.parse(localStorage.getItem("kanaToVocabulary"))
        );
      } catch (e) {
        localStorage.removeItem("cats");
      }
    }
  },
  render: (h) => h(App),
}).$mount("#app");
