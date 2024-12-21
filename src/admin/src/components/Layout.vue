<script setup>
import { useRoute, RouterLink } from "vue-router";
import { Sidebar, NormalLayout } from "@infinity-frame/infinitycomponent";

const route = useRoute();
</script>

<template>
  <Sidebar
    title="IF Admin"
    currentUserEmail="ahojky@ahojky.com"
    :currentPath="route.path"
    :links="[
      { label: 'Blog', icon: 'blog', to: '/blog' },
      { label: 'Produkty', icon: 'product', to: '/products' },
      { label: 'Objednávky', icon: 'order', to: '/orders' },
    ]"
    :RouterLink="RouterLink"
  />
  <NormalLayout>
    <router-view />
  </NormalLayout>
</template>
