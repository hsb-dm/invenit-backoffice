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
		queryKey: queryKey('detail_3', id),
		queryFn: ({ signal }) => call('detail_3', { id }, {}, undefined, signal)
	}));
</script>

<svelte:head><title>Subscription detail · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Subscription detail · {id}</h1></header>
	<QueryState pending={profile.isPending} error={profile.error} />
	{#if profile.isSuccess}
		<div class="header-actions detail-actions">
			{#each resolveActions(actions, profile.data) as action (action.operation)}<ApiAction
					{action}
					params={{ id }}
				/>{/each}
		</div>

		<section class="block">
			<h2>Subscription</h2>
			<RecordDetails data={profile.data?.subscription} />
		</section>
		<section class="block">
			<h2>Payments</h2>
			<RecordDetails data={profile.data?.payments} />
		</section>
		<section class="block">
			<h2>Billing periods</h2>
			<RecordDetails data={profile.data?.billingPeriods} />
		</section>
	{/if}
</div>
