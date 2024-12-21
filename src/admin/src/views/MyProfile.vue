<script setup>
import {
  Heading,
  ColumnsLayout,
  Box,
  TextInput,
  Button,
  Actions,
} from "@infinity-frame/infinitycomponent";
</script>

<template>
  <Heading :semanticLevel="2">Můj profil</Heading>
  <ColumnsLayout :columns="2">
    <Box title="Změna hesla">
      <form>
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
      <form>
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
        />
      </Actions>
    </Box>
  </ColumnsLayout>
</template>
