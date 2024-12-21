<script setup>
import {
  Button,
  CenterBoxLayout,
  Actions,
  TextInput,
} from "@infinity-frame/infinitycomponent";
import authStore from "../stores/auth";

const handleLogin = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");

  await authStore.login(email, password);
};
</script>

<template>
  <CenterBoxLayout title="Přihlášení">
    <p>Vítejte v administračním systému InfinityFrameworku!</p>
    <form @submit="handleLogin">
      <TextInput
        name="email"
        placeholder="Email"
        icon="mail"
        type="email"
        required
      />
      <TextInput
        name="password"
        placeholder="Heslo"
        type="password"
        icon="lock"
        required
      />
      <Actions>
        <Button
          color="primary"
          label="Přihlásit se"
          icon="login"
          type="submit"
        />
      </Actions>
    </form>
  </CenterBoxLayout>
</template>
