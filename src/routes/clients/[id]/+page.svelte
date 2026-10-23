<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { createQuery } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import { queryKey } from '#lib/api/cache.js';
	import { resolveActions } from '#lib/api/view.js';
	import ApiAction from '#lib/backoffice/ApiAction.svelte';
	import QueryState from '#lib/backoffice/QueryState.svelte';
	import RecordDetails from '#lib/backoffice/RecordDetails.svelte';
	import { actions } from './api';
	import SensitiveDocument from '#lib/backoffice/SensitiveDocument.svelte';
	import ApiList from '#lib/backoffice/ApiList.svelte';
	const id = $derived(page.params.id ?? '');
	const profile = createQuery(() => ({
		queryKey: queryKey('detail_1', id),
		queryFn: ({ signal }) => call('detail_1', { id }, {}, undefined, signal)
	}));
</script>

<svelte:head><title>Client detail · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Client detail · {id}</h1></header>
	<QueryState pending={profile.isPending} error={profile.error} />
	{#if profile.isSuccess}
		<div class="header-actions detail-actions">
			{#each resolveActions(actions, profile.data) as action (action.operation)}<ApiAction
					{action}
					params={{ id }}
				/>{/each}
		</div>

		<section class="block">
			<h2>Client profile</h2>
			<RecordDetails
				data={profile.data
					? Object.fromEntries(
							Object.entries(profile.data).filter(([key]) => key !== 'allowedActions')
						)
					: undefined}
			/>
		</section>
		<SensitiveDocument {id} />
		<section class="block">
			<a class="button" href={resolve('/kyc-review/[id]', { id })}>Review KYC</a>
		</section>
		<ApiList
			operation="list_1"
			title="Subscriptions"
			fixedQuery={{ clientId: id }}
			detail="/subscriptions"
			columns={[
				{ key: 'id', label: 'Subscription ID' },
				{ key: 'productId', label: 'Product' },
				{ key: 'status', label: 'Status' }
			]}
		/>
	{/if}
</div>
