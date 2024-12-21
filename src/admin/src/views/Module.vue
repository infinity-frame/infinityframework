<script setup>
import { useRoute } from "vue-router";
import { Heading, ColumnsLayout, Box } from "@infinity-frame/infinitycomponent";

const route = useRoute();
const moduleName = route.params.moduleName;

console.log(moduleName);
</script>

<template>
  <Heading :semanticLevel="2">Stránka modulu</Heading>
  <ColumnsLayout :columns="2">
    <Box title="Ukázka">
      <p>Takto nějak bde vypadat stránka modulu.</p>
    </Box>
    <Box title="Hustý">
      <p>Bude zde i víc sloupců coooo.</p>
    </Box>
  </ColumnsLayout>
</template>
