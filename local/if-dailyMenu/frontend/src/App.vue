<script setup>
import { onMounted, ref } from "vue";
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
	Icon,
} from "@infinity-frame/infinitycomponent";

const { apiUrl, authFetch } = useApi();
console.log(apiUrl);

const moduleApiUrl = apiUrl + "/api/infinityframe/dailyMenu";

const dailyMenus = ref([]);
const newDate = ref("");
const newMenu = ref([]);
const newItems = ref({
	item: "",
	price: "",
});

const fetchDailyMenus = async () => {
	const response = await authFetch(moduleApiUrl, { method: "GET" });
	if (response.ok) {
		dailyMenus.value = await response.json();
	} else {
		alert("Něco se pokazilo.");
	}
};

const saveMenu = async () => {
	if (!newDate.value || !newMenu.value.length) {
		alert("Vyplňte všechny údaje.");
		return;
	}

	const response = await authFetch(moduleApiUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			date: newDate.value,
			menu: newMenu.value,
		}),
	});

	if (response.ok) {
		alert("Menu bylo úspěšně uloženo.");
		newDate.value = "";
		newMenu.value = [];
		fetchDailyMenus();
	} else {
		alert("Něco se pokazilo.");
	}
};

const addItem = () => {
	newMenu.value.push(newItems.value);
	newItems.value = { item: "", price: "" };
};

console.log(onMounted(fetchDailyMenus));
</script>

<template>
	<NormalLayout>
		<Heading level="2">Denní menu</Heading>

		<Box title="Nové menu">
			<TextInput v-model="newDate" label="Datum" />

			<Box :title="`Položky v menu na ${newDate || 'vybraný den'}`">
				<ul>
					<li v-for="(item, i) in newMenu" :key="i">
						{{ item.item }} ............. {{ item.price }}
						<Icon
							@click="newMenu.splice(i, 1)"
							name="delete"
						></Icon>
					</li>
				</ul>
				<ColumnsLayout :columns="3">
					<TextInput v-model="newItems.item" placeholder="Věc" />
					<TextInput v-model="newItems.price" placeholder="Cena" />
					<Button @click="addItem()" label="Přidat položku"></Button>
				</ColumnsLayout>
			</Box>
			<Button label="Uložit menu" @click="saveMenu"></Button>
		</Box>
	</NormalLayout>
</template>

<style scoped></style>
