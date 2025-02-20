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
      if (data.type === "get_access_token") {
        console.log("Sending access token");
        iframe.value.contentWindow.postMessage(
          JSON.stringify({ type: "access_token", value: "123" }),
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
