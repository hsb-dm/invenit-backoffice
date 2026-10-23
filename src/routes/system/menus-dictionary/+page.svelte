<script lang="ts">
	import ApiList from '#lib/backoffice/ApiList.svelte';
	let type = $state('');
	let selected = $state('');
</script>

<svelte:head><title>Menus &amp; dictionary · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Menus &amp; dictionary</h1></header>
	<ApiList
		operation="listMenus_1"
		title="Menus & buttons"
		columns={[
			{ key: 'id', label: 'ID' },
			{ key: 'parentId', label: 'Parent' },
			{ key: 'name', label: 'Name' },
			{ key: 'permissionKey', label: 'Permission' },
			{ key: 'path', label: 'Path' },
			{ key: 'type', label: 'Type' },
			{ key: 'status', label: 'Status' }
		]}
	/>
	<ApiList
		operation="listDictionaries"
		title="Dictionaries"
		columns={[
			{ key: 'dictType', label: 'Type' },
			{ key: 'dictName', label: 'Name' },
			{ key: 'status', label: 'Status' }
		]}
	/>
	<section class="block">
		<h2>Dictionary entries</h2>
		<form
			class="api-filters"
			onsubmit={(event) => {
				event.preventDefault();
				selected = type.trim();
			}}
		>
			<label>Dictionary type<input required bind:value={type} /></label><button type="submit"
				>Open</button
			>
		</form>
	</section>
	{#if selected}<ApiList
			operation="listDictItems"
			title={selected}
			params={{ type: selected }}
			columns={[
				{ key: 'itemKey', label: 'Key' },
				{ key: 'labelEn', label: 'English' },
				{ key: 'labelId', label: 'Indonesian' },
				{ key: 'status', label: 'Status' }
			]}
		/>{/if}
</div>
