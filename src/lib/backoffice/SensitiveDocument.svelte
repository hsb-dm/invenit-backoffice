<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { call, request } from '#lib/api/client.js';
	let { id, kind = 'client' }: { id: string; kind?: 'client' | 'kyc' } = $props();
	let urls = $state<Record<string, string>>({});
	const document = createMutation(() => ({
		mutationFn: async () =>
			kind === 'kyc'
				? request<Record<string, string>>(`/api/admin/kyc/${encodeURIComponent(id)}/documents`)
				: { KTP: await call('ktpUrl', { id }) },
		onSuccess: (value) => {
			urls = Object.fromEntries(
				Object.entries(value).filter(
					(entry): entry is [string, string] =>
						typeof entry[1] === 'string' && entry[1].startsWith('https://')
				)
			);
		}
	}));
</script>

<section class="block">
	<h2>Identity document</h2>
	{#if Object.keys(urls).length}{#each Object.entries(urls) as [name, url] (name)}<img
				class="identity-document"
				src={url}
				alt={name === 'selfieUrl' ? 'Client selfie' : 'Client identity document'}
				referrerpolicy="no-referrer"
			/>{/each}<button
			onclick={() => {
				urls = {};
				document.reset();
			}}>Close document</button
		>
	{:else}<button disabled={document.isPending} onclick={() => document.mutate()}
			>{kind === 'kyc' ? 'View documents' : 'View KTP'}</button
		>{/if}
	{#if document.error}<p class="query-error" role="alert">{document.error.message}</p>{/if}
</section>
