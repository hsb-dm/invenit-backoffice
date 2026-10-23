<script lang="ts">
	let { pending, error }: { pending: boolean; error: Error | null } = $props();
</script>

{#if pending}<p class="query-status" role="status">Loading…</p>{/if}
{#if error}<p class="query-error" role="alert">{error.message}</p>{/if}
