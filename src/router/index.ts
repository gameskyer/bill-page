import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Form from "../views/Form.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/form",
    name: "Form",
    component: Form,
  },
  {
    path: "/pageone",
    name: "PageOne",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PageOne.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
