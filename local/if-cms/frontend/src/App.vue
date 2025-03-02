<script setup>
import { ref, watch, onMounted } from "vue";
import useApi from "./useApi";
import {
	Heading,
	Box,
	RichTextEditor,
	TextInput,
	Button,
	Actions,
	NormalLayout,
} from "@infinity-frame/infinitycomponent";

const { apiUrl, authFetch } = useApi();
const moduleApiUrl = ref("");

/**
 * Watch for changes in the apiUrl and update moduleApiUrl accordingly.
 * Fetch content blocks when apiUrl changes.
 */
watch(apiUrl, (newApiUrl) => {
	if (newApiUrl) {
		moduleApiUrl.value = newApiUrl + "/api/infinityframe/cms/contentBlock";
		fetchContentBlocks();
	}
});

const newElementId = ref("");
const newDescription = ref("");
const newContent = ref("");

const contentBlocks = ref([]);

/**
 * Fetch content blocks from the API.
 * @async
 */
const fetchContentBlocks = async () => {
	if (!moduleApiUrl.value) return;

	const response = await authFetch(moduleApiUrl.value, { method: "GET" });
	if (response.ok) {
		contentBlocks.value = await response.json();
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Save a new content block to the API.
 * @async
 */
const saveContentBlock = async () => {
	if (!newElementId.value || !newContent.value) {
		alert("Vyplňte povinné údaje.");
		return;
	}

	const response = await authFetch(moduleApiUrl.value, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			elementId: newElementId.value,
			description: newDescription.value,
			content: newContent.value,
		}),
	});

	if (response.ok) {
		fetchContentBlocks();
		newElementId.value = "";
		newDescription.value = "";
		newContent.value = "";
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Delete a content block by its ID.
 * @async
 * @param {string} blockId - The ID of the content block to delete.
 */
const deleteContentBlock = async (blockId) => {
	const response = await authFetch(moduleApiUrl.value + "/" + blockId, {
		method: "DELETE",
	});

	if (response.ok) {
		fetchContentBlocks();
	} else {
		alert("Něco se pokazilo.");
	}
};

/**
 * Fetch content blocks on component mount.
 */
onMounted(() => {
	if (apiUrl.value) {
		moduleApiUrl.value =
			apiUrl.value + "/api/infinityframe/cms/contentBlock";
		fetchContentBlocks();
	}
});
</script>

<template>
	<NormalLayout>
		<Heading :semanticLevel="2">Obsahové bloky</Heading>

		<Box title="Nový obsahový blok">
			<TextInput
				v-model="newElementId"
				placeholder="Identifikátor elemntu"
				icon="badge"
			/>
			<TextInput
				v-model="newDescription"
				placeholder="Popis"
				icon="description"
			/>
			<RichTextEditor v-model="newContent" />
			<Actions>
				<Button @click="saveContentBlock" label="Uložit" icon="save" />
			</Actions>
		</Box>

		<Heading :semanticLevel="2">Seznam obsahových bloků</Heading>
		<Box
			v-for="block in contentBlocks"
			:key="block._id"
			:title="block.elementId"
		>
			<p><strong>Popis:</strong> {{ block.description }}</p>
			<div v-html="block.content"></div>
			<Actions>
				<Button
					@click="deleteContentBlock(block._id)"
					color="danger"
					label="Smazat"
					icon="delete"
				></Button>
			</Actions>
		</Box>
	</NormalLayout>
</template>

<style>
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
@import "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";

* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
</style>
