<script setup>
import { onMounted, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { Sidebar, NormalLayout } from "@infinity-frame/infinitycomponent";
import authStore from "../stores/auth";

const route = useRoute();
</script>

<template>
  <Sidebar
    title="IF Admin"
    :currentUser="authStore.currentUser?.username"
    :currentPath="route.path"
    :links="
      authStore?.config?.modules.map((module) => ({
        label: module.name.charAt(0).toUpperCase() + module.name.slice(1),
        to: `/${module.vendor}/${module.name}`,
      }))
    "
    :RouterLink="RouterLink"
  />
  <NormalLayout>
    <router-view />
  </NormalLayout>
</template>
