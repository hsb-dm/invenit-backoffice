<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import '#lib/backoffice/api.css';
	import favicon from '#lib/assets/favicon.svg';
	import Sidebar from '#lib/backoffice/Sidebar.svelte';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser, staleTime: 15000, retry: false },
			mutations: { retry: false, gcTime: 0 }
		}
	});
	function expireSession() {
		queryClient.clear();
		void goto(resolve('/login'));
	}
	onMount(() => {
		window.addEventListener('session-expired', expireSession);
		return () => window.removeEventListener('session-expired', expireSession);
	});

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{#if page.route.id === '/login'}
		{@render children()}
	{:else}
		<div class="app-shell">
			<Sidebar />
			<main>{@render children()}</main>
		</div>
	{/if}
</QueryClientProvider>
