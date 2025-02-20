import { createRouter, createWebHistory } from "vue-router";
import { watch } from "vue";
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
          requiresAuth: true,
        },
      },
      {
        path: "/:moduleName",
        name: "Module",
        component: () => import("./views/Module.vue"),
        meta: {
          requiresAuth: true,
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
    if (to.path !== "/login") {
      next("/login");
    } else {
      next();
    }
  } else if (!to.meta.requiresAuth && authStore.currentUser) {
    if (to.path !== "/") {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

watch(
  () => authStore.currentUser,
  (newUser, oldUser) => {
    if (!newUser && oldUser) {
      router.push("/login");
    }
    if (newUser && !oldUser) {
      router.push("/");
    }
  }
);

export default router;
