<script lang="ts">
	import { resolve } from '$app/paths';
	import { createQuery } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import QueryState from '#lib/backoffice/QueryState.svelte';
	let phone = $state('');
	let purpose = $state('');
	let status = $state('');
	let from = $state('');
	let to = $state('');
	let filters = $state<Record<string, string | number>>({ page: 1 });
	const logs = createQuery(() => ({
		queryKey: ['otp', filters],
		gcTime: 0,
		staleTime: 0,
		refetchOnWindowFocus: false,
		queryFn: ({ signal }) => call('list_3', {}, filters, undefined, signal)
	}));
	function search(event: SubmitEvent) {
		event.preventDefault();
		filters = { phone: phone.trim(), purpose, status, from, to, page: 1 };
	}
</script>

<svelte:head><title>OTP log · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header">
		<h1>OTP log</h1>
		<a class="button" href={resolve('/clients')}>Clients</a>
	</header>
	<section class="block">
		<form class="api-filters" onsubmit={search}>
			<label>Phone<input type="tel" bind:value={phone} /></label><label
				>Purpose<input type="number" bind:value={purpose} /></label
			><label>Status<input type="number" bind:value={status} /></label><label
				>From<input type="date" bind:value={from} /></label
			><label>To<input type="date" bind:value={to} /></label><button type="submit">Search</button
			><button
				type="button"
				onclick={() => {
					phone = '';
					purpose = '';
					status = '';
					from = '';
					to = '';
					filters = { page: 1 };
				}}>Reset</button
			>
		</form>
		<QueryState pending={logs.isPending} error={logs.error} />
		{#if logs.isSuccess}<div class="table-wrap">
				<table>
					<thead
						><tr
							><th>Code</th><th>Phone</th><th>Status</th><th>Channel</th><th>Purpose</th><th
								>Attempts</th
							><th>Expires</th><th>Used</th></tr
						></thead
					><tbody>
						{#each logs.data?.items ?? [] as row (row.id)}<tr
								><td>{row.code ?? '—'}</td><td>{row.phone}</td><td>{row.status}</td><td
									>{row.channel}</td
								><td>{row.purpose}</td><td>{row.attemptCount}</td><td>{row.expiresAt}</td><td
									>{row.usedAt ?? '—'}</td
								></tr
							>{:else}<tr><td colspan="8" class="empty">No records</td></tr>{/each}
					</tbody>
				</table>
			</div>
			<div class="pagination">
				<button
					disabled={Number(filters.page) <= 1}
					onclick={() => {
						filters = { ...filters, page: Number(filters.page) - 1 };
					}}>Previous</button
				><span>Page {filters.page}</span><button
					disabled={!logs.data?.items?.length}
					onclick={() => {
						filters = { ...filters, page: Number(filters.page) + 1 };
					}}>Next</button
				>
			</div>{/if}
	</section>
</div>
