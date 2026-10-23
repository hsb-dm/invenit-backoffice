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
	import ApiList from '#lib/backoffice/ApiList.svelte';
	const id = $derived(page.params.id ?? '');
	const profile = createQuery(() => ({
		queryKey: queryKey('detail_2', id),
		queryFn: ({ signal }) => call('detail_2', { id }, {}, undefined, signal)
	}));
</script>

<svelte:head><title>Advisor detail · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Advisor detail · {id}</h1></header>
	<QueryState pending={profile.isPending} error={profile.error} />
	{#if profile.isSuccess}
		<div class="header-actions detail-actions">
			{#each resolveActions(actions, profile.data) as action (action.operation)}<ApiAction
					{action}
					params={{ id }}
				/>{/each}
		</div>

		<section class="block">
			<h2>Advisor profile</h2>
			<RecordDetails data={profile.data?.advisor} />
		</section>
		<section class="block">
			<h2>Products</h2>
			<RecordDetails data={profile.data?.products} />
		</section>
		<section class="block">
			<h2>Scheme history</h2>
			<RecordDetails data={profile.data?.schemeHistory} />
		</section>
		<section class="block">
			<h2>Wallet</h2>
			<RecordDetails data={profile.data?.wallet} />
		</section>
		<ApiList
			operation="listRequests"
			title="Change requests"
			params={{ id }}
			actionIdParam="rid"
			columns={[
				{ key: 'id', label: 'Request ID' },
				{ key: 'status', label: 'Status' },
				{ key: 'createdAt', label: 'Created' }
			]}
			actions={[
				{ operation: 'approveRequest', label: 'Approve' },
				{ operation: 'rejectRequest', label: 'Reject' }
			]}
		/>
	{/if}
</div>
