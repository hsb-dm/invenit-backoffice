<script lang="ts">
	import RecordDetails from './RecordDetails.svelte';
	import { label, display, type RecordData } from '#lib/api/view.js';
	let { data }: { data: unknown } = $props();
</script>

{#if data && typeof data === 'object'}
	{#if Array.isArray(data)}
		{#if data.every((value) => value === null || typeof value !== 'object')}
			<p>{display(data)}</p>
		{:else}
			{#each data as row, index (index)}<div class="record-section">
					<RecordDetails data={row} />
				</div>{/each}
		{/if}
		{#if !data.length}<p class="query-status">No records</p>{/if}
	{:else}
		<dl class="record-details">
			{#each Object.entries(data as RecordData).filter(([, value]) => value === null || typeof value !== 'object') as [key, value] (key)}
				<div>
					<dt>{label(key)}</dt>
					<dd>{display(value)}</dd>
				</div>
			{/each}
		</dl>
		{#each Object.entries(data as RecordData).filter(([, value]) => value && typeof value === 'object') as [key, value] (key)}
			<section class="record-section">
				<h3>{label(key)}</h3>
				<RecordDetails data={value} />
			</section>
		{/each}
	{/if}
{:else}<p class="query-status">{display(data)}</p>{/if}
