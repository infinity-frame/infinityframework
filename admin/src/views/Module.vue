<script setup>
import { useRoute } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";

const iframe = ref(null);

const route = useRoute();
const moduleName = route.params.moduleName; // TODO: Implement this once backend is ready

const messageHandler = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === "get_auth_token") {
      console.log("Sending auth token");
      iframe.value.contentWindow.postMessage(
        JSON.stringify({
          type: "auth_token",
          value: localStorage.getItem("authToken"),
        }),
        "*"
      );
    }
    if (data.type === "get_api_url") {
      console.log("Sending API URL");
      iframe.value.contentWindow.postMessage(
        JSON.stringify({
          type: "api_url",
          value: import.meta.env.VITE_API_URL,
        }),
        "*"
      );
    }
  } catch (error) {}
};

onMounted(() => {
  window.addEventListener("message", messageHandler);
});

onUnmounted(() => {
  window.removeEventListener("message", messageHandler);
});
</script>

<template>
  <iframe
    :src="`http://localhost:5174/`"
    class="module-view"
    ref="iframe"
  ></iframe>
</template>
