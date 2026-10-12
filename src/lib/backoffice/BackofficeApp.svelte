<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Sidebar from './Sidebar.svelte';
	import ScreenContent from './ScreenContent.svelte';
	import { screenByPath } from './screens';

	let screen = $derived(screenByPath.get(page.url.pathname));
</script>

<div class="app-shell">
	<Sidebar />
	<main>
		{#if screen}
			{#key screen.id}<ScreenContent {screen} />{/key}
		{:else}
			<section class="not-found">
				<p>404</p>
				<h1>Screen not found</h1>
				<a class="button primary" href={resolve('/')}>Back to dashboard</a>
			</section>
		{/if}
	</main>
</div>
