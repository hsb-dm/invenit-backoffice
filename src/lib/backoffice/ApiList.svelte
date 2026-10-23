<script lang="ts">
	import { resolve } from '$app/paths';
	import { createQuery } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import { queryKey } from '#lib/api/cache.js';
	import { operations, type OperationId } from '#lib/api/contract.js';
	import { rowsFrom, valueAt, display, label, type Column, type Action } from '#lib/api/view.js';
	import ApiAction from './ApiAction.svelte';
	import QueryState from './QueryState.svelte';
	let {
		operation,
		title,
		columns,
		idKey = 'id',
		detail,
		actions = [],
		create = [],
		params = {},
		actionIdParam = 'id',
		fixedQuery = {}
	}: {
		operation: OperationId;
		title: string;
		columns: Column[];
		idKey?: string;
		detail?: '/clients' | '/kyc-review' | '/products' | '/subscriptions' | '/advisors';
		actions?: Action[];
		create?: Action[];
		params?: Record<string, string | number>;
		actionIdParam?: string;
		fixedQuery?: Record<string, string | number>;
	} = $props();
	let filters = $state<Record<string, string | number>>({ page: 1 });
	let draft = $state<Record<string, string>>({});
	const query = createQuery(() => ({
		queryKey: queryKey(operation, params, { ...filters, ...fixedQuery }),
		queryFn: ({ signal }) =>
			call(operation, params, { ...filters, ...fixedQuery }, undefined, signal)
	}));
	const rows = $derived(rowsFrom(query.data));
	const total = $derived(
		query.data && typeof query.data === 'object' && 'total' in query.data
			? Number(query.data.total)
			: undefined
	);
	const parameters = $derived(
		operations[operation].parameters.filter(
			(p) => p.in === 'query' && !['page', 'size'].includes(p.name) && !(p.name in fixedQuery)
		)
	);
	function apply(event: SubmitEvent) {
		event.preventDefault();
		filters = { ...draft, page: 1 };
	}
</script>

<section class="api-list block">
	<div class="api-section-heading">
		<h2>{title}</h2>
		<div class="header-actions">
			{#each create as action (action.operation)}<ApiAction {action} {params} />{/each}
		</div>
	</div>
	{#if parameters.length}
		<form class="api-filters" onsubmit={apply}>
			{#each parameters as field (field.name)}
				<label
					>{label(field.name)}<input
						type={field.schema.type === 'integer'
							? 'number'
							: 'format' in field.schema && field.schema.format === 'date'
								? 'date'
								: 'text'}
						bind:value={draft[field.name]}
					/></label
				>
			{/each}
			<button type="submit">Search</button><button
				type="button"
				onclick={() => {
					draft = {};
					filters = { page: 1 };
				}}>Reset</button
			>
		</form>
	{/if}
	<QueryState pending={query.isPending} error={query.error} />
	{#if query.isSuccess}
		<div class="table-wrap">
			<table>
				<thead
					><tr
						>{#each columns as column (column.key)}<th>{column.label}</th
							>{/each}{#if detail || actions.length}<th>Actions</th>{/if}</tr
					></thead
				><tbody>
					{#each rows as row, index (String(valueAt(row, idKey) ?? index))}
						<tr
							>{#each columns as column (column.key)}<td>{display(valueAt(row, column.key))}</td
								>{/each}
							{#if detail || actions.length}<td
									><div class="row-actions">
										{#if detail && valueAt(row, idKey) != null}<a
												class="button small"
												href={resolve(`${detail}/[id]`, { id: String(valueAt(row, idKey)) })}
												>Open</a
											>{/if}
										{#each actions as action (action.operation)}{#if valueAt(row, idKey) != null}<ApiAction
													{action}
													params={{ ...params, [actionIdParam]: String(valueAt(row, idKey)) }}
												/>{/if}{/each}
									</div></td
								>{/if}
						</tr>
					{:else}<tr><td class="empty" colspan={columns.length + 1}>No records</td></tr>{/each}
				</tbody>
			</table>
		</div>
		{#if operations[operation].parameters.some((p) => p.name === 'page')}
			<div class="pagination">
				<span>Page {filters.page}{total === undefined ? '' : ` · ${total} records`}</span><button
					disabled={Number(filters.page) <= 1 || query.isFetching}
					onclick={() => {
						filters = { ...filters, page: Number(filters.page) - 1 };
					}}>Previous</button
				><button
					disabled={query.isFetching ||
						!rows.length ||
						(total !== undefined && Number(filters.page) * Number(filters.size ?? 50) >= total)}
					onclick={() => {
						filters = { ...filters, page: Number(filters.page) + 1 };
					}}>Next</button
				>
			</div>
		{/if}
	{/if}
</section>
