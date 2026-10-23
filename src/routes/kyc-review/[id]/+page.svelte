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
	import SensitiveDocument from '#lib/backoffice/SensitiveDocument.svelte';
	const id = $derived(page.params.id ?? '');
	const profile = createQuery(() => ({
		queryKey: queryKey('caseDetail', id),
		queryFn: ({ signal }) => call('caseDetail', { id }, {}, undefined, signal)
	}));
</script>

<svelte:head><title>KYC review · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>KYC review · {id}</h1></header>
	<QueryState pending={profile.isPending} error={profile.error} />
	{#if profile.isSuccess}
		<div class="header-actions detail-actions">
			{#each resolveActions(actions, profile.data) as action (action.operation)}<ApiAction
					{action}
					params={{ id }}
				/>{/each}
		</div>

		<div class="review-grid">
			<section class="block">
				<h2>Client information</h2>
				<RecordDetails data={profile.data?.typed} />
			</section>
			<section class="block">
				<h2>OCR result</h2>
				<RecordDetails data={profile.data?.ocr} />
			</section>
		</div>
		<section class="block">
			<h2>Risk summary</h2>
			<RecordDetails data={profile.data?.riskSummary} />
		</section>
		<section class="block">
			<h2>Verification attempts</h2>
			<RecordDetails data={profile.data?.attempts} />
		</section>
		<SensitiveDocument {id} kind="kyc" />
	{/if}
</div>
