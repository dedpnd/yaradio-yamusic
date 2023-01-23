import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/radio",
    name: "YaRadio",
    component: () => import("../views/YandexRadio.vue")
  },
  {
    path: "/music",
    name: "YaMusic",
    component: () => import("../views/YandexMusic.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
