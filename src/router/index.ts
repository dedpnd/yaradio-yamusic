import Vue from "vue";
import Router, { RouteConfig } from "vue-router";

Vue.use(Router);

const routes: Array<RouteConfig> = [
  {
    path: "/radio",
    name: "YaRadio",
    component: () => import("../views/YandexRadio.vue"),
  },
  {
    path: "/music",
    name: "YaMusic",
    component: () => import("../views/YandexMusic.vue"),
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
