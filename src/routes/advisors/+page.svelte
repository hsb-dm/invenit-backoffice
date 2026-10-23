<script lang="ts">
	import ApiList from '#lib/backoffice/ApiList.svelte';
</script>

<svelte:head><title>Advisors · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Advisors</h1></header>
	<ApiList
		operation="listAdvisors"
		title="Advisors"
		detail="/advisors"
		columns={[
			{ key: 'id', label: 'Advisor ID' },
			{ key: 'displayName', label: 'Name' },
			{ key: 'licenseNo', label: 'Licence' },
			{ key: 'licenseExpiresAt', label: 'Licence expiry' },
			{ key: 'status', label: 'Status' }
		]}
	/>
	<ApiList
		operation="listApplications"
		title="Applications"
		columns={[
			{ key: 'id', label: 'Application ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'status', label: 'Status' },
			{ key: 'createdAt', label: 'Created' }
		]}
		actions={[
			{ operation: 'licenceCheck', label: 'Check licence' },
			{ operation: 'decide_1', label: 'Decision' }
		]}
	/>
</div>
