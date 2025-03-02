<script setup>
import { onMounted, ref, watch } from "vue";
import useApi from "./useApi";
import {
	Heading,
	Box,
	TextInput,
	Button,
	NormalLayout,
	ColumnsLayout,
	Icon,
} from "@infinity-frame/infinitycomponent";

const { apiUrl, authFetch } = useApi();
const moduleApiUrl = ref("");

/**
 * Watch for changes in the apiUrl and update moduleApiUrl accordingly.
 * Fetch daily menus when apiUrl changes.
 */
watch(apiUrl, (newApiUrl) => {
	if (newApiUrl) {
		moduleApiUrl.value = newApiUrl + "/api/infinityframe/dailyMenu/menu";
		fetchDailyMenus();
	}
});

const dailyMenus = ref([]);
const newDate = ref("");
const newMenu = ref([]);
const newItems = ref({
	name: "",
	price: null,
});

/**
 * Fetch daily menus from the API.
 * @async
 */
const fetchDailyMenus = async () => {
	if (!moduleApiUrl.value) return;

	const response = await authFetch(moduleApiUrl.value, { method: "GET" });
	if (response.ok) {
		dailyMenus.value = await response.json();
		console.log(dailyMenus.value);
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Save a new menu to the API.
 * @async
 */
const saveMenu = async () => {
	if (!newDate.value || !newMenu.value.length) {
		alert("Vyplňte všechny údaje.");
		return;
	}

	console.log(
		JSON.stringify({
			date: newDate.value,
			menu: newMenu.value,
		})
	);

	const response = await authFetch(moduleApiUrl.value, {
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
		newDate.value = "";
		newMenu.value = [];
		fetchDailyMenus();
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Add a new item to the menu.
 */
const addItem = () => {
	if (!newItems.value.name || !newItems.value.price) {
		alert("Vyplňte všechny údaje položky.");
		return;
	}

	try {
		newItems.value.price = parseFloat(newItems.value.price);
	} catch (e) {
		alert("Cena musí být číslo.");
		return;
	}

	newMenu.value.push(newItems.value);
	newItems.value = { name: "", price: null };
};

/**
 * Delete a menu by its ID.
 * @async
 * @param {string} id - The ID of the menu to delete.
 */
const deleteMenu = async (id) => {
	if (!confirm("Opravdu chcete smazat toto menu?")) {
		return;
	}

	const response = await authFetch(moduleApiUrl.value + `/${id}`, {
		method: "DELETE",
	});

	if (response.ok) {
		fetchDailyMenus();
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Fetch daily menus on component mount.
 */
onMounted(() => {
	if (apiUrl.value) {
		moduleApiUrl.value = apiUrl.value + "/api/infinityframe/dailyMenu";
		fetchDailyMenus();
	}
});
</script>

<template>
	<NormalLayout>
		<Heading :semanticLevel="2">Denní menu</Heading>

		<Heading :semanticLevel="3">Nové menu</Heading>
		<TextInput
			v-model="newDate"
			placeholder="Datum ve formátu DD.MM.RRRR"
		/>

		<Box :title="`Položky v menu na ${newDate || 'vybraný den'}`">
			<ul>
				<li v-for="(item, i) in newMenu" :key="i">
					{{ item.name }} ............. {{ item.price }} Kč
					<Icon @click="newMenu.splice(i, 1)" name="delete"></Icon>
				</li>
			</ul>
			<ColumnsLayout :columns="3">
				<TextInput v-model="newItems.name" placeholder="Věc" />
				<TextInput v-model="newItems.price" placeholder="Cena" />
				<Button @click="addItem()" label="Přidat položku"></Button>
			</ColumnsLayout>
		</Box>
		<Button label="Uložit menu" @click="saveMenu"></Button>

		<Heading :semanticLevel="3">Existující meny</Heading>
		<ColumnsLayout :columns="2">
			<Box
				v-for="(menu, i) in dailyMenus"
				:key="i"
				:title="menu.date"
				:class="`today-${menu.today}`"
			>
				<ul>
					<li v-for="(item, i) in menu.menu" :key="i">
						{{ item.name }} ............. {{ item.price }}
					</li>
				</ul>
				<Button
					color="danger"
					icon="delete"
					@click="deleteMenu(menu._id)"
					label="Smazat"
				></Button>
			</Box>
		</ColumnsLayout>
	</NormalLayout>
</template>

<style>
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
@import "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";

.box.today-true {
	background-color: #e5ffda;
}

* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
</style>
