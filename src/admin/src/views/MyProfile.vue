<script setup>
import {
  Heading,
  ColumnsLayout,
  Box,
  TextInput,
  Button,
  Actions,
} from "@infinity-frame/infinitycomponent";
import authStore from "../stores/auth";

const handlePasswordChange = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const oldPassword = formData.get("oldPassword");
  const newPassword = formData.get("newPassword");
  const newPasswordAgain = formData.get("newPasswordAgain");

  if (newPassword !== newPasswordAgain) {
    alert("Nová hesla se neshodují.");
    return;
  }

  await authStore.changePassword(oldPassword, newPassword);
};

const handleEmailChange = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get("email");

  await authStore.changeEmail(email);

  event.target.reset();
};

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<template>
  <Heading :semanticLevel="2">Můj profil</Heading>
  <ColumnsLayout :columns="2">
    <Box title="Změna hesla">
      <form @submit="handlePasswordChange">
        <TextInput
          name="oldPassword"
          icon="lock"
          placeholder="Staré heslo"
          type="password"
          required
        />
        <TextInput
          name="newPassword"
          icon="lock"
          placeholder="Nové heslo"
          type="password"
          required
        />
        <TextInput
          name="newPasswordAgain"
          icon="lock"
          placeholder="Nové heslo znovu"
          type="password"
          required
        />

        <Actions>
          <Button
            color="primary"
            label="Změnit heslo"
            icon="done"
            type="submit"
          />
        </Actions>
      </form>
    </Box>
    <Box title="Změna emailu">
      <p>
        Váš aktuální email je <strong>{{ authStore.currentUser?.email }}</strong
        >.
      </p>
      <form @submit="handleEmailChange">
        <TextInput
          name="email"
          icon="mail"
          placeholder="Nový email"
          type="email"
          required
        />

        <Actions>
          <Button
            color="primary"
            label="Změnit email"
            icon="done"
            type="submit"
          />
        </Actions>
      </form>
    </Box>
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
