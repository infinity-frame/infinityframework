<script setup>
import {
  Button,
  CenterBoxLayout,
  Actions,
  TextInput,
} from "@infinity-frame/infinitycomponent";
</script>

<template>
  <CenterBoxLayout title="Přihlášení">
    <p>Vítejte v administračním systému InfinityFrameworku!</p>
    <form>
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
