import type { ComponentProps } from 'svelte';
import type ApiList from '#lib/backoffice/ApiList.svelte';
export const config = {
	operation: 'list_1',
	title: 'Subscriptions',
	columns: [
		{
			key: 'id',
			label: 'Subscription ID'
		},
		{
			key: 'clientId',
			label: 'Client'
		},
		{
			key: 'productId',
			label: 'Product'
		},
		{
			key: 'status',
			label: 'Status'
		},
		{
			key: 'createdAt',
			label: 'Created'
		}
	],
	idKey: 'id',
	actions: [],
	create: [],
	detail: '/subscriptions'
} satisfies ComponentProps<typeof ApiList>;
