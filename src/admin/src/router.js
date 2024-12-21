import { createRouter, createWebHistory } from "vue-router";
import authStore from "./stores/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/Login.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/",
    component: () => import("./components/Layout.vue"),
    children: [
      {
        path: "/my-profile",
        name: "MyProfile",
        component: () => import("./views/MyProfile.vue"),
        meta: {
          requiresAuth: false, // temporarily set to false
        },
      },
      {
        path: "/:moduleName",
        name: "Module",
        component: () => import("./views/Module.vue"),
        meta: {
          requiresAuth: false, // temporarily set to false
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  if (to.meta.requiresAuth && !authStore.currentUser) {
    next("/login");
  } else if (!to.meta.requiresAuth && authStore.currentUser) {
    next("/");
  } else {
    next();
  }
});

export default router;
