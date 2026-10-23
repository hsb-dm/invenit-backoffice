<script lang="ts">
	import ApiList from '#lib/backoffice/ApiList.svelte';
</script>

<svelte:head><title>Users &amp; roles · Invenit</title></svelte:head>
<div class="screen">
	<header class="page-header"><h1>Users &amp; roles</h1></header>
	<ApiList
		operation="listUsers"
		title="Users"
		columns={[
			{ key: 'id', label: 'ID' },
			{ key: 'username', label: 'Username' },
			{ key: 'displayName', label: 'Name' },
			{ key: 'roles', label: 'Roles' },
			{ key: 'status', label: 'Status' }
		]}
		actions={[
			{ operation: 'updateUser', label: 'Edit' },
			{ operation: 'reset2fa', label: 'Reset 2FA' }
		]}
		create={[{ operation: 'createUser', label: 'Create user' }]}
	/>
	<ApiList
		operation="listRoles"
		title="Roles"
		columns={[
			{ key: 'id', label: 'ID' },
			{ key: 'roleKey', label: 'Role key' },
			{ key: 'roleName', label: 'Name' },
			{ key: 'status', label: 'Status' }
		]}
		actions={[
			{ operation: 'listMenus', label: 'View grants' },
			{ operation: 'setMenus', label: 'Set grants' },
			{ operation: 'updateRole', label: 'Edit' },
			{ operation: 'deleteRole', label: 'Delete' }
		]}
		create={[{ operation: 'createRole', label: 'Create role' }]}
	/>
</div>
