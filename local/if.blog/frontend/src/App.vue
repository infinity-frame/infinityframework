<script setup>
import { ref, watch } from "vue";
import useApi from "./useApi";
import {
  Heading,
  Box,
  RichTextEditor,
  TextInput,
  DropdownInput,
  Button,
  Actions,
  NormalLayout,
  ColumnsLayout,
} from "@infinity-frame/infinitycomponent";

const { apiUrl, authFetch } = useApi();

const newTitle = ref("");
const newCategory = ref("");
const newContent = ref("");
const posts = ref([]);

const handleCreatePost = async () => {
  if (!newTitle.value || !newCategory.value || !newContent.value) {
    alert("Vyplňte všechny údaje.");
    return;
  }

  const response = await authFetch(apiUrl.value + "/if/blog/post", {
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
    alert("Příspěvek byl úspěšně vytvořen.");
    posts.value = [...posts.value, await response.json()];
  } else {
    alert("Něco se pokazilo.");
  }
};

const handleGetPosts = async () => {
  const response = await authFetch(apiUrl.value + "/if/blog/post", {
    method: "GET",
  });

  if (response.ok) {
    posts.value = await response.json();
  } else {
    alert("Něco se pokazilo.");
  }
};

const handleRemovePost = async (id) => {
  if (!confirm("Opravdu chcete smazat tento příspěvek?")) {
    return;
  }

  const response = await authFetch(apiUrl.value + `/if/blog/post/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Příspěvek byl úspěšně smazán.");
    posts.value = posts.value.filter((post) => post._id !== id);
  } else {
    alert("Něco se pokazilo.");
  }
};

watch(apiUrl, (newValue) => {
  if (newValue) {
    handleGetPosts();
  }
});
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

    <Heading :semanticLevel="3">Příspěvky</Heading>

    <ColumnsLayout :columns="2">
      <Box v-for="post in posts" :key="post._id" :title="post.title">
        <p>Kategorie: {{ post.category }}</p>
        <Actions>
          <Button
            color="danger"
            label="Smazat"
            icon="delete"
            @click="() => handleRemovePost(post._id)"
          />
        </Actions>
      </Box>
    </ColumnsLayout>
  </NormalLayout>
</template>
