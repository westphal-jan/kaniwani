import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Study from "@/views/Study.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/kaniwani",
    name: "Home",
    component: Home,
  },
  {
    path: "/kaniwani/study",
    name: "Study",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Study,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
