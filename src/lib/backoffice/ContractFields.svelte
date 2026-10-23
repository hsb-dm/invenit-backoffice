<script lang="ts">
	import ContractFields from './ContractFields.svelte';
	import { label, type RecordData } from '#lib/api/view.js';
	import type { Schema } from '#lib/api/form.js';
	let {
		schema,
		values = $bindable({}),
		prefix = 'field'
	}: { schema: Schema; values?: RecordData; prefix?: string } = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, raw] (key)}
	{@const field = raw as Schema}
	{@const required = schema.required?.includes(key)}
	<div class="contract-field">
		{#if field.type === 'array' && field.items?.type === 'object'}
			<span class="field-label">{label(key)}{required ? ' *' : ''}</span>
			{#each (values[key] as RecordData[]) ?? [] as row, index (index)}
				<div class="nested-fields">
					<ContractFields
						schema={field.items}
						values={row}
						prefix={`${prefix}-${key}-${index}`}
					/><button
						type="button"
						onclick={() => {
							values[key] = (values[key] as RecordData[]).filter((_, i) => i !== index);
						}}>Remove row</button
					>
				</div>
			{/each}
			<button
				type="button"
				onclick={() => {
					values[key] = [...((values[key] as RecordData[]) ?? []), {}];
				}}>Add {label(key).toLowerCase()}</button
			>
		{:else if field.type === 'object'}
			<span class="field-label">{label(key)}</span>
			<ContractFields
				schema={field}
				values={(values[key] ??= {}) as RecordData}
				prefix={`${prefix}-${key}`}
			/>
		{:else if field.type === 'boolean'}
			<label class="checkbox-field"
				><input
					type="checkbox"
					checked={values[key] === true}
					onchange={(event) => {
						values[key] = event.currentTarget.checked;
					}}
				/>{label(key)}</label
			>
		{:else}
			<label for={`${prefix}-${key}`}>{label(key)}{required ? ' *' : ''}</label>
			{#if field.pattern?.includes('|') || field.enum}
				<select
					id={`${prefix}-${key}`}
					{required}
					value={String(values[key] ?? '')}
					onchange={(event) => {
						values[key] = event.currentTarget.value;
					}}
					><option value="">Select…</option
					>{#each field.enum ?? field.pattern?.split('|') ?? [] as option (String(option))}<option
							value={String(option)}>{String(option)}</option
						>{/each}</select
				>
			{:else if field.type === 'array'}
				<input
					id={`${prefix}-${key}`}
					{required}
					placeholder="Separate values with commas"
					value={((values[key] as unknown[]) ?? []).join(', ')}
					oninput={(event) => {
						values[key] = event.currentTarget.value
							.split(',')
							.map((s) => s.trim())
							.filter(Boolean)
							.map((s) => (field.items?.type === 'integer' ? Number(s) : s));
					}}
				/>
			{:else}
				<input
					id={`${prefix}-${key}`}
					type={key.toLowerCase().includes('password')
						? 'password'
						: field.type === 'integer' || field.type === 'number'
							? 'number'
							: field.format === 'date'
								? 'date'
								: 'text'}
					step={field.type === 'integer' ? '1' : 'any'}
					{required}
					minlength={field.minLength}
					value={String(values[key] ?? '')}
					oninput={(event) => {
						const value = event.currentTarget.value;
						if (value === '') delete values[key];
						else
							values[key] =
								field.type === 'number' || field.type === 'integer' ? Number(value) : value;
					}}
				/>
			{/if}
		{/if}
	</div>
{/each}
