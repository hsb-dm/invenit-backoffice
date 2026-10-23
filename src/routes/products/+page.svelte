<script lang="ts">
	import ApiList from '#lib/backoffice/ApiList.svelte';
	import { config } from './api';
</script>

<svelte:head><title>Products · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Products</h1></header>
	<ApiList {...config} />
</div>
