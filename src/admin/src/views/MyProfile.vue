<script setup>
import {
  Heading,
  ColumnsLayout,
  Box,
  Button,
  Actions,
} from "@infinity-frame/infinitycomponent";
import authStore from "../stores/auth";

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<template>
  <Heading :semanticLevel="2">Můj profil</Heading>
  <ColumnsLayout :columns="2">
    <Box title="Odhlášení">
      <p>Po odhlášení bude nutné znovu zadat přihlašovací údaje.</p>

      <Actions>
        <Button
          color="danger"
          label="Odhlásit se"
          icon="logout"
          type="submit"
          @click="handleLogout"
        />
      </Actions>
    </Box>
  </ColumnsLayout>
</template>
