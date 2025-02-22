<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const iframe = ref(null);

const route = useRoute();
const moduleName = route.params.moduleName;
console.log(moduleName);

onMounted(() => {
  window.addEventListener("message", (event) => {
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
    } catch (error) {}
  });
});
</script>

<template>
  <iframe
    :src="`http://localhost:5174/`"
    class="module-view"
    ref="iframe"
  ></iframe>
</template>
