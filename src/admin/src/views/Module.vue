<script setup>
import { useRoute } from "vue-router";
import {
  Heading,
  ColumnsLayout,
  Box,
  RichTextEditor,
  TextInput,
  DropdownInput,
  Button,
  Actions,
} from "@infinity-frame/infinitycomponent";

const route = useRoute();
const moduleName = route.params.moduleName;

console.log(moduleName);
</script>

<template>
  <Heading :semanticLevel="2">Ukázkový modul</Heading>

  <Box title="Editor">
    <RichTextEditor />
  </Box>

  <ColumnsLayout :columns="2">
    <Box title="Formulář">
      <p>Toto je ukázkový formulář nacházející se v malém kontejneru.</p>
      <form>
        <TextInput
          name="title"
          icon="title"
          placeholder="Titulek"
          type="text"
          required
        />
        <TextInput
          name="author"
          icon="person"
          placeholder="Jméno autora"
          type="text"
          required
        />
        <DropdownInput
          name="category"
          icon="category"
          placeholder="Kategorie"
          :options="[
            { label: 'Kategorie 1', value: 'category1' },
            { label: 'Kategorie 2', value: 'category2' },
            { label: 'Kategorie 3', value: 'category3' },
          ]"
          required
        />

        <Actions>
          <Button color="primary" label="Vytvořit" icon="add" type="submit" />
        </Actions>
      </form>
    </Box>
    <Box title="Odstranění">
      <p>Tento kontejner slouží k ukázce tlačítka s barvou danger.</p>
      <Actions>
        <Button color="danger" label="Odstranit" icon="delete" />
      </Actions>
    </Box>
  </ColumnsLayout>
</template>
