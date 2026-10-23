<script lang="ts">
	import { resolve } from '$app/paths';
	import { createQuery } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import { queryKey } from '#lib/api/cache.js';
	import QueryState from '#lib/backoffice/QueryState.svelte';
	let range = $state('14d');
	const dashboard = createQuery(() => ({
		queryKey: queryKey('dashboard', range),
		queryFn: ({ signal }) => call('dashboard', {}, { range }, undefined, signal)
	}));
</script>

<svelte:head><title>Dashboard · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header">
		<h1>Dashboard</h1>
		<label
			>Range <select bind:value={range}
				><option value="14d">14 days</option><option value="30d">30 days</option></select
			></label
		>
	</header>
	<QueryState pending={dashboard.isPending} error={dashboard.error} />
	{#if dashboard.isSuccess}<div class="kpi-grid">
			{#each [{ label: 'KYC open', value: dashboard.data?.queue?.kycOpen }, { label: 'KYC breached', value: dashboard.data?.queue?.kycBreached }, { label: 'Payments pending', value: dashboard.data?.queue?.paymentsPending }, { label: 'Refunds pending', value: dashboard.data?.queue?.refundsPending }, { label: 'MRR (IDR)', value: dashboard.data?.money?.mrrIdr }, { label: 'Paid today (IDR)', value: dashboard.data?.money?.paidTodayIdr }, { label: 'Active subscriptions', value: dashboard.data?.money?.activeSubscriptions }] as tile (tile.label)}<div
					class="kpi"
				>
					<span>{tile.label}</span><strong>{tile.value?.toLocaleString('id-ID') ?? '—'}</strong>
				</div>{/each}
		</div>
		<section class="block">
			<h2>Operations</h2>
			<div class="header-actions detail-actions">
				<a class="button" href={resolve('/kyc-review')}>KYC review</a><a
					class="button"
					href={resolve('/finance/payments-refunds')}>Payments &amp; refunds</a
				><a class="button" href={resolve('/clients')}>Clients</a>
			</div>
		</section>
		<section class="block">
			<h2>Charts &amp; integration health</h2>
			<p class="query-status">API belum tersedia.</p>
			<button disabled title="API belum tersedia">Marketplace control</button>
		</section>
	{/if}
</div>
