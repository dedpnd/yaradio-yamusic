import Vue from "vue";
import Router, { RouteConfig } from "vue-router";

Vue.use(Router);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/music",
  },
  {
    path: "/music",
    name: "YaMusic",
    component: () => import("../views/YandexMusic.vue"),
  },
  {
    path: "*",
    redirect: "/music",
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
