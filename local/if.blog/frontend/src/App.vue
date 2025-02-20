<script setup>
import {
  Heading,
  Box,
  RichTextEditor,
  TextInput,
  DropdownInput,
  Button,
  Actions,
  NormalLayout,
} from "@infinity-frame/infinitycomponent";
import { onMounted, onUnmounted, ref } from "vue";

const accessToken = ref(null);
const waitingForAccessToken = ref(false);

const requestAccessToken = () => {
  window.top.postMessage(JSON.stringify({ type: "get_access_token" }), "*");
  waitingForAccessToken.value = true;
};

const waitForAccessToken = async () => {
  if (!accessToken.value && waitingForAccessToken.value) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await waitForAccessToken();
  }
};

const authFetch = async (url, options) => {
  if (!accessToken.value) {
    requestAccessToken();
    await waitForAccessToken();
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken.value}`,
    },
  });

  if (response.status === 401) {
    requestAccessToken();
    await waitForAccessToken();
    return await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
  }

  return response;
};

onMounted(() => {
  window.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "access_token") {
        console.log("Received access token", data.value);
        accessToken.value = data.value;
        waitingForAccessToken.value = false;
      }
    } catch (error) {}
  });
});

onUnmounted(() => {
  window.removeEventListener("message");
});

const newTitle = ref("");
const newCategory = ref("");
const newContent = ref("");

const handleCreatePost = async () => {
  if (!newTitle.value || !newCategory.value || !newContent.value) {
    alert("Vyplňte všechny údaje.");
    return;
  }

  const response = await authFetch("http://localhost:3000/api/if/blog/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle.value,
      category: newCategory.value,
      content: newContent.value,
    }),
  });

  if (response.ok) {
    alert("Post byl úspěšně vytvořen.");
    newTitle.value = "";
    newCategory.value = "";
    newContent.value = "";
  } else {
    alert("Něco se pokazilo.");
  }
};
</script>

<template>
  <NormalLayout class="normal normal--no-padding">
    <Heading :semanticLevel="2">Blog</Heading>

    <Box title="Nový post">
      <TextInput
        name="title"
        icon="title"
        placeholder="Titulek"
        type="text"
        v-model="newTitle"
        required
      />
      <DropdownInput
        name="category"
        icon="category"
        placeholder="Kategorie"
        v-model="newCategory"
        :options="[
          { label: 'Novinky', value: 'news' },
          { label: 'Návody', value: 'guides' },
          { label: 'Tipy a triky', value: 'tips' },
        ]"
        required
      />
      <RichTextEditor v-model="newContent" />
      <Actions>
        <Button
          color="primary"
          label="Vytvořit"
          icon="add"
          @click="handleCreatePost"
        />
      </Actions>
    </Box>
  </NormalLayout>
</template>
