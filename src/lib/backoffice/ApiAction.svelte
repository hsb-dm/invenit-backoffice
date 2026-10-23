<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { call } from '#lib/api/client.js';
	import { affectedResources } from '#lib/api/cache.js';
	import { operations } from '#lib/api/contract.js';
	import type { Action, RecordData } from '#lib/api/view.js';
	import ContractFields from './ContractFields.svelte';
	import RecordDetails from './RecordDetails.svelte';
	let { action, params = {} }: { action: Action; params?: Record<string, string | number> } =
		$props();
	let dialog: HTMLDialogElement;
	const headingId = $props.id();
	let values = $state<RecordData>({});
	let pathValues = $state<Record<string, string>>({});
	let confirmed = $state(false);
	let done = $state(false);
	let result = $state<unknown>();
	const schema = $derived.by(() => {
		const source = operations[action.operation].schema;
		if (!('properties' in source) || !action.choices) return source;
		return {
			...source,
			properties: Object.fromEntries(
				Object.entries(source.properties).map(([key, field]) => [
					key,
					action.choices?.[key] ? { ...field, enum: action.choices[key] } : field
				])
			)
		};
	});
	const client = useQueryClient();
	const mutation = createMutation(() => ({
		mutationFn: (body: RecordData) =>
			call(action.operation, { ...params, ...pathValues }, {}, body),
		onSuccess: async (data) => {
			result = data;
			done = true;
			const affected = affectedResources(action.operation);
			await client.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'admin' && affected.has(String(query.queryKey[1]))
			});
		}
	}));
	function open() {
		values = { ...action.values };
		pathValues = {};
		confirmed = false;
		done = false;
		result = undefined;
		mutation.reset();
		dialog.showModal();
	}
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!confirmed || mutation.isPending) return;
		try {
			await mutation.mutateAsync(values);
		} catch {
			/* The mutation displays the backend error. */
		}
	}
</script>

<button type="button" onclick={open}>{action.label}</button>
<dialog
	class="action-dialog"
	aria-labelledby={headingId}
	bind:this={dialog}
	oncancel={(event) => {
		if (mutation.isPending) event.preventDefault();
	}}
	onclose={() => {
		values = {};
		pathValues = {};
		result = undefined;
		mutation.reset();
	}}
>
	<h2 id={headingId}>{action.label}</h2>
	{#if done}
		<p role="status">Request completed successfully.</p>
		{#if result}<RecordDetails data={result} />{/if}
		<div class="dialog-actions"><button onclick={() => dialog.close()}>Close</button></div>
	{:else}
		<form onsubmit={submit}>
			{#each operations[action.operation].parameters.filter((p) => p.in === 'path' && !(p.name in params)) as field (field.name)}
				<label class="contract-field"
					>{field.name}<input required bind:value={pathValues[field.name]} /></label
				>
			{/each}
			<ContractFields {schema} bind:values />
			<label class="checkbox-field"
				><input type="checkbox" bind:checked={confirmed} required />Confirm this action</label
			>
			{#if mutation.error}<p class="query-error" role="alert">{mutation.error.message}</p>{/if}
			<div class="dialog-actions">
				<button type="button" disabled={mutation.isPending} onclick={() => dialog.close()}
					>Cancel</button
				><button class="primary" type="submit" disabled={mutation.isPending || !confirmed}
					>{mutation.isPending ? 'Saving…' : 'Confirm'}</button
				>
			</div>
		</form>
	{/if}
</dialog>
