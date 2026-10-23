import type { ComponentProps } from 'svelte';
import type ApiList from '#lib/backoffice/ApiList.svelte';
export const config = {
	operation: 'list_4',
	title: 'Clients',
	columns: [
		{
			key: 'clientId',
			label: 'Client ID'
		},
		{
			key: 'name',
			label: 'Name'
		},
		{
			key: 'phone',
			label: 'Phone'
		},
		{
			key: 'status',
			label: 'Status'
		},
		{
			key: 'kycStatus',
			label: 'KYC status'
		},
		{
			key: 'createdAt',
			label: 'Created'
		}
	],
	idKey: 'clientId',
	actions: [],
	create: [],
	detail: '/clients'
} satisfies ComponentProps<typeof ApiList>;
