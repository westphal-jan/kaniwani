import Vue from "vue";
import { mapMutations } from "vuex";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { getUserData } from "./api";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  mounted() {
    if (
      !this.$store.state.accessToken &&
      process.env.NODE_ENV === "production"
    ) {
      this.$router.push({ path: "/kaniwani" });
      return;
    }
    getUserData(this.$store.state.accessToken).then((userData) => {
      this.setUserData(userData.data);
    });
  },
  methods: {
    ...mapMutations(["setUserData"]),
  },
  render: (h) => h(App),
}).$mount("#app");
