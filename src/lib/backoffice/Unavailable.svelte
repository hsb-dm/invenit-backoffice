<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<svelte:head><title>{title} · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>{title}</h1></header>
	<section class="block">
		<h2>API belum tersedia</h2>
		<p class="query-status">Data dan aksi akan tersedia setelah layanan ini siap.</p>
		<button disabled>Belum tersedia</button>
	</section>
</div>
