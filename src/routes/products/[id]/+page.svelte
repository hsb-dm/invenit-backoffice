<script lang="ts">
	import { page } from '$app/state';
	import { createQuery } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import { queryKey } from '#lib/api/cache.js';
	import { resolveActions } from '#lib/api/view.js';
	import ApiAction from '#lib/backoffice/ApiAction.svelte';
	import QueryState from '#lib/backoffice/QueryState.svelte';
	import RecordDetails from '#lib/backoffice/RecordDetails.svelte';
	import { actions } from './api';

	const id = $derived(page.params.id ?? '');
	const profile = createQuery(() => ({
		queryKey: queryKey('detail', id),
		queryFn: ({ signal }) => call('detail', { id }, {}, undefined, signal)
	}));
</script>

<svelte:head><title>Product detail · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Product detail · {id}</h1></header>
	<QueryState pending={profile.isPending} error={profile.error} />
	{#if profile.isSuccess}
		<div class="header-actions detail-actions">
			{#each resolveActions(actions, profile.data) as action (action.operation)}<ApiAction
					{action}
					params={{ id }}
				/>{/each}
			<button disabled title="API belum tersedia">Pause</button>
			<button disabled title="API belum tersedia">Unpublish</button>
		</div>

		<section class="block">
			<h2>Product information</h2>
			<RecordDetails
				data={profile.data
					? Object.fromEntries(
							Object.entries(profile.data).filter(
								([key]) => !['currentPricing', 'latestStat', 'allowedActions'].includes(key)
							)
						)
					: undefined}
			/>
		</section>
		<section class="block">
			<h2>Current pricing</h2>
			<RecordDetails data={profile.data?.currentPricing} />
		</section>
		<section class="block">
			<h2>Latest performance</h2>
			<RecordDetails data={profile.data?.latestStat} />
		</section>
	{/if}
</div>
