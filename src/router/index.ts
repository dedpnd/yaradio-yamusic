import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/radio",
    name: "YaRadio",
    // route level code-splitting
    // this generates a separate chunk (YaRadio.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "YandexRadio" */ "../views/YandexRadio.vue")
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
