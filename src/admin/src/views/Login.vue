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
      <TextInput name="username" label="Email" icon="mail" required />
      <TextInput
        name="password"
        label="Heslo"
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
