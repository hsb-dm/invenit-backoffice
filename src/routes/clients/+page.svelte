<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiList from '#lib/backoffice/ApiList.svelte';
	import { config } from './api';
</script>

<svelte:head><title>Clients · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header">
		<h1>Clients</h1>
		<a class="button" href={resolve('/clients/otp-log')}>OTP log</a>
	</header>
	<ApiList {...config} />
</div>
